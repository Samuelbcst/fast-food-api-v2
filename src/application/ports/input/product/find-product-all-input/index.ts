import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindProductAllInputPort
      extends UseCase<void, Product[]> {}
