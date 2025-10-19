import { Category } from "@entities/category/category"

/**
 * Output Port for finding all categories
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindCategoryAllOutputPort {
    execute(): Promise<Category[]>
    finish(): Promise<void>
}
