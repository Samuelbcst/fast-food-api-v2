import { PaymentStatus } from "@entities/payment/payment"
import { CreatePaymentCommand, CreatePaymentInputPort } from "@application/ports/input/payment/create-payment-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { CreatePaymentOutputPort } from "@application/ports/output/payment/create-payment-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class CreatePaymentUseCase implements CreatePaymentInputPort {
    constructor(
        private createPaymentOutputPort: CreatePaymentOutputPort,
        private findOrderByIdOutputPort: FindOrderByIdOutputPort
    ) {}

    async execute(input: CreatePaymentCommand) {
        try {
            const order = await this.findOrderByIdOutputPort.execute(
                input.orderId
            )
            if (!order) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Order not found"),
                }
            }

            const amount =
                input.amount !== undefined ? Number(input.amount) : Number(order.totalAmount)

            if (Number.isNaN(amount) || amount <= 0) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(400, "Payment amount must be greater than zero"),
                }
            }

            if (Number(amount) !== Number(order.totalAmount)) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(
                        400,
                        "Payment amount must match order total"
                    ),
                }
            }

            const created = await this.createPaymentOutputPort.create({
                orderId: order.id,
                amount,
                paymentStatus: PaymentStatus.PENDING,
                paidAt: null,
            })
            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to create payment"
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await this.createPaymentOutputPort.finish()
        await this.findOrderByIdOutputPort.finish()
    }
}
