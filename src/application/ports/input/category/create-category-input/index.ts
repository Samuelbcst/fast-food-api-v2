import { Category } from "@entities/category/category"
import { UseCase } from "@application/use-cases/base-use-case"
import { BaseEntity } from "@entities/base-entity"

export interface CreateCategoryCommand extends Omit<Category, keyof BaseEntity> {}

export interface CreateCategoryInputPort 
    extends UseCase<CreateCategoryCommand, Category> {}

