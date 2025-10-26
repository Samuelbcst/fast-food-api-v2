import { DeleteCustomerCommand, DeleteCustomerInputPort } from "@application/ports/input/customer/delete-customer-input"
import { DeleteCustomerOutputPort } from "@application/ports/output/customer/delete-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class DeleteCustomerUseCase implements DeleteCustomerInputPort {
    constructor(private deleteCustomerOutputPort: DeleteCustomerOutputPort) {}

    async execute(input: DeleteCustomerCommand) {
        try {
            const deleted = await this.deleteCustomerOutputPort.execute(input.id)
            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Customer not found.", 404),
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
        return this.deleteCustomerOutputPort.finish()
    }
}
