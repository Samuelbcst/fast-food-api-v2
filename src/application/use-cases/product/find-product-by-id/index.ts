import { FindProductByIdCommand, FindProductByIdInputPort } from "@application/ports/input/product/find-product-by-id-input"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindProductByIdUseCase implements FindProductByIdInputPort {
    constructor(private findProductByIdOutputPort: FindProductByIdOutputPort) {}

    async execute(input: FindProductByIdCommand) {
        try {
            const product = await this.findProductByIdOutputPort.execute(
                input.id
            )

            if (!product) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Product not found."),
                }
            }

            return {
                success: product !== null,
                result: product,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findProductByIdOutputPort.finish()
    }
}
