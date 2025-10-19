import { Category } from "@entities/category/category"
import { UseCase } from "@application/use-cases/base-use-case"

export interface DeleteCategoryCommand {
    id: number
}

export interface DeleteCategoryInputPort 
    extends UseCase<DeleteCategoryCommand, Category> {}

