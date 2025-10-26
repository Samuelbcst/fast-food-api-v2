import { makeDeleteProductOutputPort } from "@persistence/prisma/product/delete-product-repository/make-delete-product-repository"
import { makeDeleteProductUseCase } from "@application/use-cases/product/delete-product/make-delete-product-use-case"

export const makeDeleteProductFactory = async () => {
    const deleteProductRepository = await makeDeleteProductOutputPort()
    const useCase = makeDeleteProductUseCase(deleteProductRepository)
    return useCase
}
