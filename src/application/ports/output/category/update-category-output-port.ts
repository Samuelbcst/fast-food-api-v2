import { Category } from "@entities/category/category"

/**
 * Output Port for updating a category
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateCategoryOutputPort {
    execute(input: {
        id: number
        name?: string
        description?: string
    }): Promise<Category | null>
    finish(): Promise<void>
}
