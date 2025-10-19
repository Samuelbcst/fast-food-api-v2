import { DeletePaymentCommand, DeletePaymentInputPort } from "@application/ports/input/payment/delete-payment-input"
import { DeletePaymentOutputPort } from "@application/ports/output/payment/delete-payment-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class DeletePaymentUseCase implements DeletePaymentInputPort {
    constructor(private deletePaymentOutputPort: DeletePaymentOutputPort) {}

    async execute(input: DeletePaymentCommand) {
        try {
            const deleted = await this.deletePaymentOutputPort.execute(input.id)
            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Payment not found."),
                }
            }
            return {
                success: true,
                result: deleted,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.deletePaymentOutputPort.finish()
    }
}
