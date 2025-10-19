import { makeDeleteCategoryRepository } from "@persistence/prisma/category/delete-category-repository/make-delete-category-repository"
import { makeDeleteCategoryUseCase } from "@use-cases/category/delete-category/make-delete-category-use-case"

export const makeDeleteCategoryFactory = async () => {
    const deleteCategoryRepository = await makeDeleteCategoryRepository()
    const useCase = makeDeleteCategoryUseCase(deleteCategoryRepository)
    return useCase
}
