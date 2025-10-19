import { makeCreateOrderItemRepository } from "@persistence/prisma/order-item/create-order-item-repository/make-create-order-item-repository"
import { makeCreateOrderItemUseCase } from "@use-cases/order-item/create-order-item/make-create-order-item-use-case"

export const makeCreateOrderItemFactory = async () => {
    const repository = await makeCreateOrderItemRepository()
    const useCase = makeCreateOrderItemUseCase(repository)
    return useCase
}
