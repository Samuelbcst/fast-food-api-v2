import { Product } from "@entities/product/product"

/**
 * Output Port for finding all products
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindProductAllOutputPort {
    execute(): Promise<Product[]>
    finish(): Promise<void>
}
