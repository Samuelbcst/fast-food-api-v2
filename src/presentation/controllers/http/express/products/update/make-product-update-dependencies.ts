import { makeUpdateProductRepository } from "@persistence/prisma/product/update-product-repository/make-update-product-repository"
import { makeUpdateProductUseCase } from "@use-cases/product/update-product/make-update-product-use-case"

export const makeUpdateProductFactory = async () => {
    const updateProductRepository = await makeUpdateProductRepository()
    const useCase = makeUpdateProductUseCase(updateProductRepository)
    return useCase
}
