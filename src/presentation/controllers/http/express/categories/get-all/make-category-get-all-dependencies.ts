import { makeFindCategoryAllRepository } from "@persistence/prisma/category/find-category-all-repository/make-find-category-all-repository"
import { makeFindCategoryAllUseCase } from "@use-cases/category/find-category-all/make-find-category-all-use-case"

export const makeGetCategoryAllFactory = async () => {
    const repository = await makeFindCategoryAllRepository()
    const useCase = makeFindCategoryAllUseCase(repository)
    return useCase
}
