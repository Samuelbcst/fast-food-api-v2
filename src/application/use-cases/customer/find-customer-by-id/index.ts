import { FindCustomerByIdCommand, FindCustomerByIdInputPort } from "@application/ports/input/customer/find-customer-by-id-input"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindCustomerByIdUseCase implements FindCustomerByIdInputPort {
    constructor(
        private findCustomerByIdOutputPort: FindCustomerByIdOutputPort
    ) {}

    async execute(input: FindCustomerByIdCommand) {
        try {
            const customer = await this.findCustomerByIdOutputPort.execute(
                input.id
            )

            if (!customer) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Customer not found."),
                }
            }

            return {
                success: customer !== null,
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
        return this.findCustomerByIdOutputPort.finish()
    }
}
