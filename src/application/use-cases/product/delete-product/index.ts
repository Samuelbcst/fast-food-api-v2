import { DeleteProductCommand, DeleteProductInputPort } from "@application/ports/input/product/delete-product-input"
import { DeleteProductOutputPort } from "@application/ports/output/product/delete-product-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class DeleteProductUseCase implements DeleteProductInputPort {
    constructor(private deleteProductOutputPort: DeleteProductOutputPort) {}

    async execute(input: DeleteProductCommand) {
        try {
            const deleted = await this.deleteProductOutputPort.execute(input.id)
            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Product not found."),
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
        return this.deleteProductOutputPort.finish()
    }
}
