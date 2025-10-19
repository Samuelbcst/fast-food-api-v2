import { Category } from "@entities/category/category"

/**
 * Output Port for deleting a category
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeleteCategoryOutputPort {
    delete(id: number): Promise<Category | null>
    finish(): Promise<void>
}
