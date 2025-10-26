import { makeUpdateOrderItemOutputPort } from "@persistence/prisma/order-item/update-order-item-repository/make-update-order-item-repository"
import { makeUpdateOrderItemUseCase } from "@application/use-cases/order-item/update-order-item/make-update-order-item-use-case"

export const makeUpdateOrderItemFactory = async () => {
    const updateOrderItemRepository = await makeUpdateOrderItemOutputPort()
    const useCase = makeUpdateOrderItemUseCase(updateOrderItemRepository)
    return useCase
}
