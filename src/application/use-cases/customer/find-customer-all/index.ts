import { FindCustomerAllInputPort } from "@application/ports/input/customer/find-customer-all-input"
import { FindCustomerAllOutputPort } from "@application/ports/output/customer/find-customer-all-output-port"

export class FindCustomerAllUseCase implements FindCustomerAllInputPort {
    constructor(private findCustomerAllOutputPort: FindCustomerAllOutputPort) {}

    async execute() {
        try {
            const customers = await this.findCustomerAllOutputPort.execute()
            return {
                success: true,
                result: customers,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findCustomerAllOutputPort.finish()
    }
}
