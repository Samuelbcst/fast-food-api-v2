import { Product } from "@entities/product/product"

/**
 * Output Port for finding products by category
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindProductByCategoryOutputPort {
    execute(categoryId: number): Promise<Product[]>
    finish(): Promise<void>
}
