import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindProductByCategoryCommand {
    categoryId: number
}

export interface FindProductByCategoryInputPort
    extends UseCase<FindProductByCategoryCommand, Product[]> {}
