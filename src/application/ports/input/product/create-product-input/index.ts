import { Product } from "@entities/product/product"
import { UseCase } from "@application/use-cases/base-use-case"
import { BaseEntity } from "@entities/base-entity"

export interface CreateProductCommand extends Omit<Product, keyof BaseEntity> {}

export interface CreateProductInputPort
    extends UseCase<CreateProductCommand, Product> {}
