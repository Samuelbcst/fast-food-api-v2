import { FindPaymentByOrderIdCommand, FindPaymentByOrderIdInputPort } from "@application/ports/input/payment/find-payment-by-order-id-input"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindPaymentByOrderIdUseCase
    implements FindPaymentByOrderIdInputPort
{
    constructor(
        private readonly repository: FindPaymentByOrderIdOutputPort
    ) {}

    async execute(input: FindPaymentByOrderIdCommand) {
        try {
            const payment = await this.repository.execute(input.orderId)
            if (!payment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Payment not found for order", 404),
                }
            }
            return {
                success: true,
                result: payment,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to find payment by order id",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
