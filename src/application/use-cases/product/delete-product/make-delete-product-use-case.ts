import { DeleteProductInputPort } from "@application/ports/input/product/delete-product-input"
import { DeleteProductOutputPort } from "@application/ports/output/product/delete-product-output-port"
import { DeleteProductUseCase } from "."

export const makeDeleteProductUseCase = (
    repository: DeleteProductOutputPort
): DeleteProductInputPort => new DeleteProductUseCase(repository)
