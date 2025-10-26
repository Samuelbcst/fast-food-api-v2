import { UpdatePaymentCommand, UpdatePaymentInputPort } from "@application/ports/input/payment/update-payment-input"
import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class UpdatePaymentUseCase implements UpdatePaymentInputPort {
    constructor(private updatePaymentOutputPort: UpdatePaymentOutputPort) {}

    async execute(input: UpdatePaymentCommand) {
        try {
            const payment = await this.updatePaymentOutputPort.execute(input)

            if (!payment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Payment not found.", 404),
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
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to update payment"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.updatePaymentOutputPort.finish()
    }
}
