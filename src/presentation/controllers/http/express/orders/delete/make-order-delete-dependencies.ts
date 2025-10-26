import { makeDeleteOrderOutputPort } from "@persistence/prisma/order/delete-order-repository/make-delete-order-repository"
import { makeDeleteOrderUseCase } from "@application/use-cases/order/delete-order/make-delete-order-use-case"

export const makeDeleteOrderFactory = async () => {
    const deleteOrderRepository = await makeDeleteOrderOutputPort()
    const useCase = makeDeleteOrderUseCase(deleteOrderRepository)
    return useCase
}
