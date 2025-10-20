import { makeCreateOrderRepository } from "@persistence/prisma/order/create-order-repository/make-create-order-repository"
import { makeFindProductByIdRepository } from "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository"
import { makeCreateOrderUseCase } from "@use-cases/order/create-order/make-create-order-use-case"

export const makeCreateOrderFactory = async () => {
    const repository = await makeCreateOrderRepository()
    const productRepository = await makeFindProductByIdRepository()
    const useCase = makeCreateOrderUseCase(repository, productRepository)
    return useCase
}
