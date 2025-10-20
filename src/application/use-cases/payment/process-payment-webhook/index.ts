import { ProcessPaymentWebhookCommand, ProcessPaymentWebhookInputPort } from "@application/ports/input/payment/process-payment-webhook-input"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { OrderStatus } from "@entities/order/order"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"

export class ProcessPaymentWebhookUseCase
    implements ProcessPaymentWebhookInputPort
{
    constructor(
        private readonly findPaymentByOrderIdOutputPort: FindPaymentByOrderIdOutputPort,
        private readonly updatePaymentOutputPort: UpdatePaymentOutputPort,
        private readonly updateOrderStatusUseCase: UpdateOrderStatusInputPort
    ) {}

    async execute(input: ProcessPaymentWebhookCommand) {
        try {
            if (
                input.status !== PaymentStatus.APPROVED &&
                input.status !== PaymentStatus.REJECTED
            ) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(
                        400,
                        `Unsupported payment status: ${input.status}`
                    ),
                }
            }

            const payment = await this.findPaymentByOrderIdOutputPort.execute(
                input.orderId
            )

            if (!payment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Payment not found for order"),
                }
            }

            const mappedStatus = input.status
            const paidAt = mappedStatus === PaymentStatus.APPROVED
                ? input.paidAt ?? new Date()
                : null

            const updatedPayment = await this.updatePaymentOutputPort.execute({
                id: payment.id,
                paymentStatus: mappedStatus,
                paidAt,
            })

            if (!updatedPayment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Payment not found"),
                }
            }

            let orderStatus: OrderStatus | undefined

            if (mappedStatus === PaymentStatus.APPROVED) {
                const updateOrderResult = await this.updateOrderStatusUseCase.execute({
                    id: payment.orderId,
                    status: OrderStatus.PREPARING,
                })

                if (!updateOrderResult.success || !updateOrderResult.result) {
                    return {
                        success: false,
                        result: null,
                        error:
                            updateOrderResult.error ||
                            new CustomError(400, "Failed to update order status"),
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
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to process payment webhook"
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
