import { Product } from "@entities/product/product"

/**
 * Output Port for creating a product
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateProductOutputPort {
    // Use DB-shaped create input (categoryId as number) at the persistence boundary.
    create(input: {
        name: string
        description?: string | null
        price: number
        categoryId: number
        active?: boolean | null
    }): Promise<Product>
    finish(): Promise<void>
}
