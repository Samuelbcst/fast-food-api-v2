import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindProductByIdCommand {
    id: number
}

export interface FindProductByIdInputPort
    extends UseCase<FindProductByIdCommand, Product> {}
