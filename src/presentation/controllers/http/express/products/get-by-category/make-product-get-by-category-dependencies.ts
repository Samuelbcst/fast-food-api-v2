import { makeFindProductByCategoryRepository } from "@persistence/prisma/product/find-product-by-category-repository/make-find-product-by-category-repository"
import { FindProductByCategoryUseCase } from "@use-cases/product/find-product-by-category"

export const makeGetProductByCategoryFactory = async () => {
    const repository = await makeFindProductByCategoryRepository()
    const useCase = new FindProductByCategoryUseCase(repository)
    return useCase
}
