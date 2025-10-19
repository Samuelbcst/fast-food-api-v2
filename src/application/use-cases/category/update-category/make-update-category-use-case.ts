import { UpdateCategoryInputPort } from "@application/ports/input/category/update-category-input"
import { UpdateCategoryOutputPort } from "@application/ports/output/category/update-category-output-port"
import { UpdateCategoryUseCase } from "."

export const makeUpdateCategoryUseCase = (
    repository: UpdateCategoryOutputPort
): UpdateCategoryInputPort => new UpdateCategoryUseCase(repository)
