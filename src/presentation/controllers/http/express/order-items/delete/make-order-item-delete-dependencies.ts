import { makeDeleteOrderItemRepository } from "@persistence/prisma/order-item/delete-order-item-repository/make-delete-order-item-repository"
import { makeDeleteOrderItemUseCase } from "@use-cases/order-item/delete-order-item/make-delete-order-item-use-case"

export const makeDeleteOrderItemFactory = async () => {
    const deleteOrderItemRepository = await makeDeleteOrderItemRepository()
    const useCase = makeDeleteOrderItemUseCase(deleteOrderItemRepository)
    return useCase
}
