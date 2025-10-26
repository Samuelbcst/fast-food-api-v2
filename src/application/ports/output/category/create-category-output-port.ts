import { Category } from "@entities/category/category"

/**
 * Output Port for creating a category
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateCategoryOutputPort {
    /**
     * Create a new category in the database
     * @param category The category entity to persist
     * @returns The persisted category
     */
    create(category: Category): Promise<Category>

    /**
     * Cleanup resources (e.g., close database connections)
     */
    finish(): Promise<void>
}
