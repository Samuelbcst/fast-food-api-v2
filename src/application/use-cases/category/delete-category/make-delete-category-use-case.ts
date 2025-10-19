import { DeleteCategoryInputPort } from "@application/ports/input/category/delete-category-input"
import { DeleteCategoryOutputPort } from "@application/ports/output/category/delete-category-output-port"
import { DeleteCategoryUseCase } from "."

export const makeDeleteCategoryUseCase = (
    repository: DeleteCategoryOutputPort
): DeleteCategoryInputPort => new DeleteCategoryUseCase(repository)
