import { makeCreateOrderRepository } from "@persistence/prisma/order/create-order-repository/make-create-order-repository"
import { makeCreateOrderUseCase } from "@use-cases/order/create-order/make-create-order-use-case"

export const makeCreateOrderFactory = async () => {
    const repository = await makeCreateOrderRepository()
    const useCase = makeCreateOrderUseCase(repository)
    return useCase
}
