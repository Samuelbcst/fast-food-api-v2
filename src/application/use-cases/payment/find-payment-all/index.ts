import { FindPaymentAllInputPort } from "@application/ports/input/payment/find-payment-all-input"
import { FindPaymentAllOutputPort } from "@application/ports/output/payment/find-payment-all-output-port"

export class FindPaymentAllUseCase implements FindPaymentAllInputPort {
    constructor(private findPaymentAllOutputPort: FindPaymentAllOutputPort) {}

    async execute() {
        try {
            const payments = await this.findPaymentAllOutputPort.execute()
            return {
                success: true,
                result: payments,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findPaymentAllOutputPort.finish()
    }
}
