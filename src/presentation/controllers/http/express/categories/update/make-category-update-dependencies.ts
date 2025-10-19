import { makeUpdateCategoryRepository } from "@persistence/prisma/category/update-category-repository/make-update-category-repository"
import { makeUpdateCategoryUseCase } from "@use-cases/category/update-category/make-update-category-use-case"

export const makeUpdateCategoryFactory = async () => {
    const updateCategoryRepository = await makeUpdateCategoryRepository()
    const useCase = makeUpdateCategoryUseCase(updateCategoryRepository)
    return useCase
}
