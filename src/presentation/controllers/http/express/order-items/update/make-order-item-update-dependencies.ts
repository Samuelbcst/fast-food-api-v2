import { makeUpdateOrderItemRepository } from "@persistence/prisma/order-item/update-order-item-repository/make-update-order-item-repository"
import { makeUpdateOrderItemUseCase } from "@use-cases/order-item/update-order-item/make-update-order-item-use-case"

export const makeUpdateOrderItemFactory = async () => {
    const updateOrderItemRepository = await makeUpdateOrderItemRepository()
    const useCase = makeUpdateOrderItemUseCase(updateOrderItemRepository)
    return useCase
}
