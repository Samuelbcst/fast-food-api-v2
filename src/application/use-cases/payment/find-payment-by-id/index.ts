import { FindPaymentByIdCommand, FindPaymentByIdInputPort } from "@application/ports/input/payment/find-payment-by-id-input"
import { FindPaymentByIdOutputPort } from "@application/ports/output/payment/find-payment-by-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindPaymentByIdUseCase implements FindPaymentByIdInputPort {
    constructor(private findPaymentByIdOutputPort: FindPaymentByIdOutputPort) {}

    async execute(input: FindPaymentByIdCommand) {
        try {
            const payment = await this.findPaymentByIdOutputPort.execute(
                input.id
            )

            if (!payment) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Payment not found."),
                }
            }

            return {
                success: payment !== null,
                result: payment,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findPaymentByIdOutputPort.finish()
    }
}
