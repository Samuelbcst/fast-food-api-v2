import { Product } from "@entities/product/product"

/**
 * Output Port for finding a product by ID
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindProductByIdOutputPort {
    execute(id: number): Promise<Product | null>
    finish(): Promise<void>
}
