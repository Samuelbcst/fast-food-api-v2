import { FindCategoryAllInputPort } from "@application/ports/input/category/find-category-all-input"
import { FindCategoryAllOutputPort } from "@application/ports/output/category/find-category-all-output-port"
import { FindCategoryAllUseCase } from "."

export const makeFindCategoryAllUseCase = (
    repository: FindCategoryAllOutputPort
): FindCategoryAllInputPort => new FindCategoryAllUseCase(repository)
