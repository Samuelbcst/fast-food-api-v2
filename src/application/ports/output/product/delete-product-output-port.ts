import { Product } from "@entities/product/product"

/**
 * Output Port for deleting a product
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeleteProductOutputPort {
    // Accept either a numeric id or an object { id: number } for backward compatibility
    execute(idOrParam: number | { id: number }): Promise<Product | null>
    finish(): Promise<void>
}
