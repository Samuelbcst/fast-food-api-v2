import { FindProductByCategoryCommand, FindProductByCategoryInputPort } from "@application/ports/input/product/find-product-by-category-input"
import { FindProductByCategoryOutputPort } from "@application/ports/output/product/find-product-by-category-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindProductByCategoryUseCase implements FindProductByCategoryInputPort {
    constructor(
        private findProductByCategoryOutputPort: FindProductByCategoryOutputPort
    ) {}

    async execute(input: FindProductByCategoryCommand) {
        try {
            const products = await this.findProductByCategoryOutputPort.execute(
                input.categoryId
            )
            if (
                !products ||
                (Array.isArray(products) && products.length === 0)
            ) {
                return {
                    success: false,
                    result: [],
                    error: new CustomError(
                        404,
                        "No products found for this category."
                    ),
                }
            }
            return {
                success: true,
                result: Array.isArray(products) ? products : [products],
            }
        } catch (error) {
            return {
                success: false,
                result: [],
                error: new CustomError(
                    400,
                    (error as Error)?.message ||
                        "Failed to find products by category"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findProductByCategoryOutputPort.finish()
    }
}
