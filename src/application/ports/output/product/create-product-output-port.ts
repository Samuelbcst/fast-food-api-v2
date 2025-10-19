import { BaseEntity } from "@entities/base-entity"
import { Product } from "@entities/product/product"

/**
 * Output Port for creating a product
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateProductOutputPort {
    create(input: Omit<Product, keyof BaseEntity>): Promise<Product>
    finish(): Promise<void>
}
