import { Category } from "@entities/category/category"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindCategoryAllInputPort
      extends UseCase<void, Category[]> {}
      