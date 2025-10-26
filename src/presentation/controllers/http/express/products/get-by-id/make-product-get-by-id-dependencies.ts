import { makeFindProductByIdOutputPort } from "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository"
import { makeFindProductByIdUseCase } from "@application/use-cases/product/find-product-by-id/make-find-product-by-id-use-case"

export const makeGetProductByIdFactory = async () => {
    const repository = await makeFindProductByIdOutputPort()
    const useCase = makeFindProductByIdUseCase(repository)
    return useCase
}
