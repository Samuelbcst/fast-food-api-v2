import { makeCreateCategoryRepository } from "@persistence/prisma/category/create-category-repository/make-create-category-repository"
import { makeCreateCategoryUseCase } from "@use-cases/category/create-category/make-create-category-use-case"

export const makeCreateCategoryFactory = async () => {
    const repository = await makeCreateCategoryRepository()
    const useCase = makeCreateCategoryUseCase(repository)
    return useCase
}
