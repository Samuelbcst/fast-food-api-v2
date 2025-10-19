import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"

export interface DeleteProductCommand {
    id: number
}

export interface DeleteProductInputPort
    extends UseCase<DeleteProductCommand, Product | null> {}
