import { makeCreateProductRepository } from "@persistence/prisma/product/create-product-repository/make-create-product-repository"
import { makeCreateProductUseCase } from "@use-cases/product/create-product/make-create-product-use-case"

export const makeCreateProductFactory = async () => {
    const repository = await makeCreateProductRepository()
    const useCase = makeCreateProductUseCase(repository)
    return useCase
}
