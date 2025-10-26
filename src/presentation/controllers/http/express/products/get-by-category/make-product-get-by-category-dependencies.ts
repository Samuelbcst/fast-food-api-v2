import { makeFindProductByCategoryOutputPort } from "@persistence/prisma/product/find-product-by-category-repository/make-find-product-by-category-repository"
import { FindProductByCategoryUseCase } from "@application/use-cases/product/find-product-by-category"

export const makeGetProductByCategoryFactory = async () => {
    const repository = await makeFindProductByCategoryOutputPort()
    const useCase = new FindProductByCategoryUseCase(repository)
    return useCase
}
