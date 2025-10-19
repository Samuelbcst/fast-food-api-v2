import { CreateProductCommand, CreateProductInputPort } from "@application/ports/input/product/create-product-input"
import { CreateProductOutputPort } from "@application/ports/output/product/create-product-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class CreateProductUseCase implements CreateProductInputPort {
    constructor(private createProductOutputPort: CreateProductOutputPort) {}

    async execute(input: CreateProductCommand) {
        try {
            const created = await this.createProductOutputPort.create(input)
            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to create product"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createProductOutputPort.finish()
    }
}
