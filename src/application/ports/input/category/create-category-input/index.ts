import { Category } from "@entities/category/category"
import { UseCase } from "@application/use-cases/base-use-case"

/**
 * Command for creating a new category
 * Simple DTO representing the data needed to create a category
 */
export interface CreateCategoryCommand {
    name: string
    description: string
}

export interface CreateCategoryInputPort
    extends UseCase<CreateCategoryCommand, Category> {}

