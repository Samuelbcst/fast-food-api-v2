import { makeDeleteOrderItemOutputPort } from "@persistence/prisma/order-item/delete-order-item-repository/make-delete-order-item-repository"
import { makeDeleteOrderItemUseCase } from "@application/use-cases/order-item/delete-order-item/make-delete-order-item-use-case"

export const makeDeleteOrderItemFactory = async () => {
    const deleteOrderItemRepository = await makeDeleteOrderItemOutputPort()
    const useCase = makeDeleteOrderItemUseCase(deleteOrderItemRepository)
    return useCase
}
