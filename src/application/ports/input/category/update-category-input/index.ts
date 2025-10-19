import { Category } from "@entities/category/category"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdateCategoryCommand {
    id: number
    name?: string
    description?: string
}

export interface UpdateCategoryInputPort
    extends UseCase<UpdateCategoryCommand, Category> {}
