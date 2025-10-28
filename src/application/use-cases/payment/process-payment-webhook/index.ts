import { ProcessPaymentWebhookCommand, ProcessPaymentWebhookInputPort } from "@application/ports/input/payment/process-payment-webhook-input"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { OrderStatus } from "@entities/order/order"
import { Payment, PaymentStatus, PaymentDomainError } from "@entities/payment/payment"
import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Process Payment Webhook Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading payment domain entity
 * 2. Calling domain methods (approve/reject) instead of direct mutation
 * 3. Domain validates status transitions (PENDING → APPROVED/REJECTED only)
 * 4. Domain raises PaymentApprovedEvent or PaymentRejectedEvent
 * 5. Events dispatched after successful persistence
 *
 * This is a critical use case in the system - it processes payment provider callbacks
 * and triggers the order preparation workflow when payment is approved.
 *
 * Changes from anemic version:
 * - Use payment.approve() or payment.reject() domain methods
 * - Domain raises PaymentApprovedEvent/PaymentRejectedEvent
 * - Event handlers can trigger side effects (notifications, analytics)
 * - Business rule validation in domain layer
 */
export class ProcessPaymentWebhookUseCase
    implements ProcessPaymentWebhookInputPort
{
    constructor(
        private readonly findPaymentByOrderIdOutputPort: FindPaymentByOrderIdOutputPort,
        private readonly updatePaymentOutputPort: UpdatePaymentOutputPort,
        private readonly updateOrderStatusUseCase: UpdateOrderStatusInputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: ProcessPaymentWebhookCommand) {
        try {
            // Step 1: Validate webhook input
            if (
                input.status !== PaymentStatus.APPROVED &&
                input.status !== PaymentStatus.REJECTED
            ) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(
                        `Unsupported payment status: ${input.status}`,
                        400
                    ),
                }
            }

            // Step 2: Load payment domain entity
            const payment = await this.findPaymentByOrderIdOutputPort.execute(
                input.orderId
            )

            if (!payment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Payment not found for order", 404),
                }
            }

            // Step 3: Call domain method (approve or reject)
            // Domain entity will:
            // - Validate status transition (PENDING → APPROVED/REJECTED only)
            // - Set paidAt timestamp for approved payments
            // - Raise PaymentApprovedEvent or PaymentRejectedEvent
            // - Throw PaymentDomainError if validation fails
            try {
                if (input.status === PaymentStatus.APPROVED) {
                    payment.approve()
                } else {
                    payment.reject("Payment rejected by provider")
                }
            } catch (error) {
                if (error instanceof PaymentDomainError) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(error.message, 400),
                    }
                }
                throw error
            }

            // Step 4: Persist the updated payment
            const updatedPayment = await this.updatePaymentOutputPort.execute({
                id: Number(payment.id),
                paymentStatus: payment.paymentStatus,
                paidAt: payment.paidAt,
            })

            if (!updatedPayment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Payment not found", 404),
                }
            }

            // Step 5: Dispatch domain events
            // This will trigger PaymentApprovedHandler or PaymentRejectedHandler
            const events = payment.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[ProcessPaymentWebhookUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 6: Clear events
            payment.clearDomainEvents()

            // Step 7: If approved, update order status to start kitchen workflow
            let orderStatus: OrderStatus | undefined

            if (input.status === PaymentStatus.APPROVED) {
                const updateOrderResult = await this.updateOrderStatusUseCase.execute({
                    id: Number(payment.orderId),
                    status: OrderStatus.PREPARING,
                })

                if (!updateOrderResult.success || !updateOrderResult.result) {
                    return {
                        success: false,
                        result: null,
                        error:
                            updateOrderResult.error ||
                            new CustomError("Failed to update order status", 400),
                    }
                }

                orderStatus = updateOrderResult.result.status
            }

            return {
                success: true,
                result: {
                    payment: updatedPayment as Payment,
                    orderStatus,
                },
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to process payment webhook",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.findPaymentByOrderIdOutputPort.finish(),
            this.updatePaymentOutputPort.finish(),
            this.updateOrderStatusUseCase.onFinish(),
        ])
    }
}
