import { UseCaseResult } from "@application/use-cases/use-case-result"
import { Product } from "@entities/product/product"
import {
    ErrorResponse,
    PresentationResponse,
    Presenter,
    SuccessResponse,
} from "./presenter"

/**
 * Product view model
 */
export interface ProductViewModel {
    id: string | number
    name: string
    description?: string
    price: number
    categoryId: number
    active?: boolean
    createdAt?: Date
    updatedAt?: Date
}

/**
 * Product Presenter
 */
export class ProductPresenter
    implements Presenter<Product, PresentationResponse<ProductViewModel>>
{
    present(
        result: UseCaseResult<Product>
    ): PresentationResponse<ProductViewModel> {
        if (result.success && result.result) {
            const product = result.result
            return {
                data: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    categoryId: product.categoryId,
                    active: product.active,
                    // createdAt: omitted (infrastructure concern)
                    // updatedAt: omitted (infrastructure concern)
                },
                statusCode: 200,
            }
        } else {
            const error = result.error
            return {
                error: error?.name || "Error",
                message: error?.message || "An error occurred",
                statusCode: error?.statusCode || 400,
            }
        }
    }
}

/**
 * Product List Presenter
 */
export class ProductListPresenter
    implements Presenter<Product[], PresentationResponse<ProductViewModel[]>>
{
    present(
        result: UseCaseResult<Product[]>
    ): PresentationResponse<ProductViewModel[]> {
        if (result.success && result.result) {
            const products = result.result
            return {
                data: products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    categoryId: p.categoryId,
                    active: p.active,
                    // createdAt: omitted (infrastructure concern)
                    // updatedAt: omitted (infrastructure concern)
                })),
                statusCode: 200,
            }
        } else {
            const error = result.error
            return {
                error: error?.name || "Error",
                message: error?.message || "An error occurred",
                statusCode: error?.statusCode || 400,
            }
        }
    }
}
