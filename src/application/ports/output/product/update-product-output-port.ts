import { Product } from "@entities/product/product"

/**
 * Output Port for updating a product
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateProductOutputPort {
    execute(input: {
        id: number
        name?: string
        description?: string
        price?: number
        categoryId?: number
        active?: boolean
    }): Promise<Product | null>
    finish(): Promise<void>
}
