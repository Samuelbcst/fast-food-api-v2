import { UpdateCustomerCommand, UpdateCustomerInputPort } from "@application/ports/input/customer/update-customer-input"
import { UpdateCustomerOutputPort } from "@application/ports/output/customer/update-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class UpdateCustomerUseCase implements UpdateCustomerInputPort {
    constructor(private updateCustomerOutputPort: UpdateCustomerOutputPort) {}

    async execute(input: UpdateCustomerCommand) {
        try {
            const customer = await this.updateCustomerOutputPort.execute(input)

            if (!customer) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Customer not found.", 404),
                }
            }

            return {
                success: true,
                result: customer,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.updateCustomerOutputPort.finish()
    }
}
