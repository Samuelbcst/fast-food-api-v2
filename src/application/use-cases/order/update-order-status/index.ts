import { UpdateOrderStatusCommand, UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { OrderStatus, OrderDomainError } from "@entities/order/order"
import { PaymentStatus } from "@entities/payment/payment"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Update Order Status Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Calling domain method (updateStatus) instead of direct mutation
 * 3. Domain entity validates status transitions
 * 4. Domain raises events automatically
 * 5. Events dispatched after successful persistence
 *
 * Changes from anemic version:
 * - Status transition validation moved to Order entity
 * - Use case calls order.updateStatus() domain method
 * - Domain raises OrderUpdatedEvent automatically
 * - Use case dispatches events after persistence
 */
export class UpdateOrderStatusUseCase implements UpdateOrderStatusInputPort {
    constructor(
        private readonly updateOrderStatusOutputPort: UpdateOrderStatusOutputPort,
        private readonly findOrderByIdOutputPort: FindOrderByIdOutputPort,
        private readonly findPaymentByOrderIdOutputPort: FindPaymentByOrderIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: UpdateOrderStatusCommand) {
        try {
            // Step 1: Load existing order (domain entity)
            const currentOrder = await this.findOrderByIdOutputPort.execute(
                input.id
            )

            if (!currentOrder) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order not found.", 404),
                }
            }

            // Cast incoming status string to domain OrderStatus
            const desiredStatus = (input.status as unknown) as OrderStatus

            // Step 2: Business rule - Check payment approval before preparing
            if (desiredStatus === OrderStatus.PREPARING) {
                const payment = await this.findPaymentByOrderIdOutputPort.execute(
                    Number(currentOrder.id)
                )
                if (!payment || payment.paymentStatus !== PaymentStatus.APPROVED) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(
                            "Payment must be approved before preparing the order",
                            400
                        ),
                    }
                }
            }

            // Step 3: Call domain method (not direct mutation!)
            // Domain entity will:
            // - Validate status transition (RECEIVED → PREPARING → READY → FINISHED)
            // - Enforce business rules (e.g., order must have items to be READY)
            // - Raise OrderUpdatedEvent
            // - Throw OrderDomainError if validation fails
            try {
                currentOrder.updateStatus(desiredStatus)
            } catch (error) {
                if (error instanceof OrderDomainError) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(error.message, 400),
                    }
                }
                throw error
            }

            // Step 4: Persist the updated order
            const updatedOrder = await this.updateOrderStatusOutputPort.execute({
                id: input.id,
                status: desiredStatus,
            })

            if (!updatedOrder) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order not found.", 404),
                }
            }

            // Step 5: Dispatch domain events
            const events = currentOrder.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[UpdateOrderStatusUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 6: Clear events
            currentOrder.clearDomainEvents()

            return {
                success: true,
                result: updatedOrder,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error)?.message || "Failed to update order status",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.updateOrderStatusOutputPort.finish(),
            this.findOrderByIdOutputPort.finish(),
            this.findPaymentByOrderIdOutputPort.finish(),
        ])
    }
}
