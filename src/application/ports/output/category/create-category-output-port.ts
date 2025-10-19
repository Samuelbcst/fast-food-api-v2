import { BaseEntity } from "@entities/base-entity"
import { Category } from "@entities/category/category"

/**
 * Output Port for creating a category
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateCategoryOutputPort {
    create(input: Omit<Category, keyof BaseEntity>): Promise<Category>
    finish(): Promise<void>
}
