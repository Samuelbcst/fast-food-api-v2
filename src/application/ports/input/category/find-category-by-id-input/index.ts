import { Category } from "@entities/category/category"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindCategoryByIdCommand {
    id: number
}

export interface FindCategoryByIdInputPort
    extends UseCase<FindCategoryByIdCommand, Category> {}
