import { CreateCustomerCommand, CreateCustomerInputPort } from "@application/ports/input/customer/create-customer-input"
import { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class CreateCustomerUseCase implements CreateCustomerInputPort {
    constructor(private createCustomerOutputPort: CreateCustomerOutputPort) {}

    async execute(input: CreateCustomerCommand) {
        try {
            const customer = await this.createCustomerOutputPort.create(input)
            return {
                success: true,
                result: customer,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to create customer"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createCustomerOutputPort.finish()
    }
}
