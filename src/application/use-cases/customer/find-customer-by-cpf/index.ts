import { FindCustomerByCpfCommand, FindCustomerByCpfInputPort } from "@application/ports/input/customer/find-customer-by-cpf-input"
import { FindCustomerByCpfOutputPort } from "@application/ports/output/customer/find-customer-by-cpf-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindCustomerByCpfUseCase implements FindCustomerByCpfInputPort {
    constructor(
        private findCustomerByCpfOutputPort: FindCustomerByCpfOutputPort
    ) {}

    async execute(input: FindCustomerByCpfCommand) {
        try {
            const customer = await this.findCustomerByCpfOutputPort.execute(
                input.cpf
            )

            if (!customer) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Customer not found.", 404),
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
        return this.findCustomerByCpfOutputPort.finish()
    }
}
