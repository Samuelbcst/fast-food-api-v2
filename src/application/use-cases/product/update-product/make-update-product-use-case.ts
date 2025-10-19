import { UpdateProductInputPort } from "@application/ports/input/product/update-product-input"
import { UpdateProductOutputPort } from "@application/ports/output/product/update-product-output-port"
import { UpdateProductUseCase } from "."

export const makeUpdateProductUseCase = (
    repository: UpdateProductOutputPort
): UpdateProductInputPort => new UpdateProductUseCase(repository)
