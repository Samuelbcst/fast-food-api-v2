import { makeUpdateOrderRepository } from "@persistence/prisma/order/update-order-repository/make-update-order-repository"
import { makeUpdateOrderUseCase } from "@use-cases/order/update-order/make-update-order-use-case"

export const makeUpdateOrderFactory = async () => {
    const updateOrderRepository = await makeUpdateOrderRepository()
    const useCase = makeUpdateOrderUseCase(updateOrderRepository)
    return useCase
}
