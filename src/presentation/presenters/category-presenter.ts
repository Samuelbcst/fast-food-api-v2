import { UseCaseResult } from "@application/use-cases/use-case-result"
import { Category } from "@entities/category/category"
import {
    ErrorResponse,
    PresentationResponse,
    Presenter,
    SuccessResponse,
} from "./presenter"

/**
 * Category view model - represents how category data is presented to clients
 *
 * NOTE: ID can be string (UUID from domain) or number (from Prisma DB)
 * createdAt/updatedAt are optional because domain entities don't track these
 */
export interface CategoryViewModel {
    id: string | number
    name: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
}

/**
 * Category Presenter - transforms category use case results into HTTP-ready responses
 */
export class CategoryPresenter
    implements Presenter<Category, PresentationResponse<CategoryViewModel>>
{
    present(
        result: UseCaseResult<Category>
    ): PresentationResponse<CategoryViewModel> {
        if (result.success && result.result) {
            const category = result.result
            return {
                data: {
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    // createdAt/updatedAt are infrastructure concerns, not in domain entity
                    // In a production system, you'd create a DTO that includes these from Prisma
                },
                statusCode: 200,
            }
        } else {
            const error = result.error
            return {
                error: error?.name || "Error",
                message: error?.message || "An error occurred",
                details: undefined,
                statusCode: error?.statusCode || 400,
            }
        }
    }
}

/**
 * Category List Presenter - transforms list of categories into HTTP-ready responses
 */
export class CategoryListPresenter
    implements Presenter<Category[], PresentationResponse<CategoryViewModel[]>>
{
    present(
        result: UseCaseResult<Category[]>
    ): PresentationResponse<CategoryViewModel[]> {
        if (result.success && result.result) {
            const categories = result.result
            return {
                data: categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    description: c.description,
                    // createdAt/updatedAt omitted (infrastructure concerns)
                })),
                statusCode: 200,
            }
        } else {
            const error = result.error
            return {
                error: error?.name || "Error",
                message: error?.message || "An error occurred",
                details: undefined,
                statusCode: error?.statusCode || 400,
            }
        }
    }
}
