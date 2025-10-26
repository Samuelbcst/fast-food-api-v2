import { UpdateProductCommand, UpdateProductInputPort } from "@application/ports/input/product/update-product-input"
import { UpdateProductOutputPort } from "@application/ports/output/product/update-product-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class UpdateProductUseCase implements UpdateProductInputPort {
    constructor(private updateProductOutputPort: UpdateProductOutputPort) {}

    async execute(input: UpdateProductCommand) {
        try {
            const product = await this.updateProductOutputPort.execute(input)

            if (!product) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Product not found.", 404),
                }
            }

            return {
                success: true,
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
        return this.updateProductOutputPort.finish()
    }
}
