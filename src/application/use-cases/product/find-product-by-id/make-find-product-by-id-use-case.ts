import { FindProductByIdInputPort } from "@application/ports/input/product/find-product-by-id-input"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { FindProductByIdUseCase } from "."

export const makeFindProductByIdUseCase = (
    repository: FindProductByIdOutputPort
): FindProductByIdInputPort => new FindProductByIdUseCase(repository)
