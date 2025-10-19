import { CreateCategoryInputPort } from "@application/ports/input/category/create-category-input"
import { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"
import { CreateCategoryUseCase } from "."

export const makeCreateCategoryUseCase = (
    repository: CreateCategoryOutputPort
): CreateCategoryInputPort => new CreateCategoryUseCase(repository)
