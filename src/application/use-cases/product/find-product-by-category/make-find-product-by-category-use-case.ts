import { FindProductByCategoryInputPort } from "@application/ports/input/product/find-product-by-category-input"
import { FindProductByCategoryOutputPort } from "@application/ports/output/product/find-product-by-category-output-port"
import { FindProductByCategoryUseCase } from "."

export const makeFindProductByCategoryUseCase = (
    repository: FindProductByCategoryOutputPort
): FindProductByCategoryInputPort => new FindProductByCategoryUseCase(repository)
