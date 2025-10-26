import { makeUpdateProductOutputPort } from "@persistence/prisma/product/update-product-repository/make-update-product-repository"
import { makeUpdateProductUseCase } from "@application/use-cases/product/update-product/make-update-product-use-case"

export const makeUpdateProductFactory = async () => {
    const updateProductRepository = await makeUpdateProductOutputPort()
    const useCase = makeUpdateProductUseCase(updateProductRepository)
    return useCase
}
