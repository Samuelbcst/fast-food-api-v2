import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"

/**
 * Command for creating a new product
 * Simple DTO representing the data needed to create a product
 */
export interface CreateProductCommand {
    name: string
    description?: string
    price: number
    categoryId: string
    active?: boolean
}

export interface CreateProductInputPort
    extends UseCase<CreateProductCommand, Product> {}
