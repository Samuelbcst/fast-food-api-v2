import { Category } from "@entities/category/category"

/**
 * Output Port for finding a category by ID
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindCategoryByIdOutputPort {
    execute(id: number): Promise<Category | null>
    finish(): Promise<void>
}
