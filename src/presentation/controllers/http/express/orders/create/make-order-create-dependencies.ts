import { makeCreateOrderOutputPort } from "@persistence/prisma/order/create-order-repository/make-create-order-repository"
import { makeFindProductByIdOutputPort } from "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository"
import { makeCreateOrderUseCase } from "@application/use-cases/order/create-order/make-create-order-use-case"

export const makeCreateOrderFactory = async () => {
    const repository = await makeCreateOrderOutputPort()
    const productRepository = await makeFindProductByIdOutputPort()
    const useCase = makeCreateOrderUseCase(repository, productRepository)
    return useCase
}
