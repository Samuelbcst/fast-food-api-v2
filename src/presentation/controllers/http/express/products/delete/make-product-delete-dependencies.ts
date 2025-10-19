import { makeDeleteProductRepository } from "@persistence/prisma/product/delete-product-repository/make-delete-product-repository"
import { makeDeleteProductUseCase } from "@use-cases/product/delete-product/make-delete-product-use-case"

export const makeDeleteProductFactory = async () => {
    const deleteProductRepository = await makeDeleteProductRepository()
    const useCase = makeDeleteProductUseCase(deleteProductRepository)
    return useCase
}
