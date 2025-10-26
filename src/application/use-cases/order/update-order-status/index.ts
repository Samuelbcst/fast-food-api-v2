import { UpdateOrderStatusCommand, UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { OrderStatus } from "@entities/order/order"
import { PaymentStatus } from "@entities/payment/payment"

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.RECEIVED]: [OrderStatus.PREPARING],
    [OrderStatus.PREPARING]: [OrderStatus.READY],
    [OrderStatus.READY]: [OrderStatus.FINISHED],
    [OrderStatus.FINISHED]: [],
}

export class UpdateOrderStatusUseCase implements UpdateOrderStatusInputPort {
    constructor(
        private readonly updateOrderStatusOutputPort: UpdateOrderStatusOutputPort,
        private readonly findOrderByIdOutputPort: FindOrderByIdOutputPort,
        private readonly findPaymentByOrderIdOutputPort: FindPaymentByOrderIdOutputPort
    ) {}

    async execute(input: UpdateOrderStatusCommand) {
        try {
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

            if (
                !allowedTransitions[currentOrder.status]?.includes(
                    input.status
                )
            ) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(
                        400,
                        `Invalid status transition from ${currentOrder.status} to ${input.status}`
                    ),
                }
            }

            if (input.status === OrderStatus.PREPARING) {
                const payment =
                    await this.findPaymentByOrderIdOutputPort.execute(
                        currentOrder.id
                    )
                if (!payment || payment.paymentStatus !== PaymentStatus.APPROVED) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(
                            400,
                            "Payment must be approved before preparing the order"
                        ),
                    }
                }
            }

            const updatedOrder = await this.updateOrderStatusOutputPort.execute(
                input
            )

            if (!updatedOrder) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order not found.", 404),
                }
            }

            return {
                success: true,
                result: updatedOrder,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error)?.message || "Failed to update order status"
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
