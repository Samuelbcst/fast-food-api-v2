import { CreateProductInputPort } from "@application/ports/input/product/create-product-input"
import { CreateProductOutputPort } from "@application/ports/output/product/create-product-output-port"
import { CreateProductUseCase } from "."

export const makeCreateProductUseCase = (
    repository: CreateProductOutputPort
): CreateProductInputPort => new CreateProductUseCase(repository)
