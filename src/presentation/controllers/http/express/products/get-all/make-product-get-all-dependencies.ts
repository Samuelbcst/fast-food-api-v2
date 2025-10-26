import { makeFindProductAllOutputPort } from "@persistence/prisma/product/find-product-all-repository/make-find-product-all-repository"
import { makeFindProductAllUseCase } from "@application/use-cases/product/find-product-all/make-find-product-all-use-case"

export const makeGetProductAllFactory = async () => {
    const repository = await makeFindProductAllOutputPort()
    const useCase = makeFindProductAllUseCase(repository)
    return useCase
}
