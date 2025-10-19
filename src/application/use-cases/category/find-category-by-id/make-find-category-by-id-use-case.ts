import { FindCategoryByIdInputPort } from "@application/ports/input/category/find-category-by-id-input"
import { FindCategoryByIdOutputPort } from "@application/ports/output/category/find-category-by-id-output-port"
import { FindCategoryByIdUseCase } from "."

export const makeFindCategoryByIdUseCase = (
    repository: FindCategoryByIdOutputPort
): FindCategoryByIdInputPort => new FindCategoryByIdUseCase(repository)
