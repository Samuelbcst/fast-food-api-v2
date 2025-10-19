import { Product } from "@entities/product/product"

/**
 * Output Port for deleting a product
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeleteProductOutputPort {
    execute(id: number): Promise<Product | null>
    finish(): Promise<void>
}
