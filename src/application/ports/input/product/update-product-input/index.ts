import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdateProductCommand {
    id: number
    name?: string
    description?: string
    price?: number
    categoryId?: number
    active?: boolean
}

export interface UpdateProductInputPort
    extends UseCase<UpdateProductCommand, Product> {}
