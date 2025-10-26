import { makeUpdateOrderOutputPort } from "@persistence/prisma/order/update-order-repository/make-update-order-repository"
import { makeUpdateOrderUseCase } from "@application/use-cases/order/update-order/make-update-order-use-case"

export const makeUpdateOrderFactory = async () => {
    const updateOrderRepository = await makeUpdateOrderOutputPort()
    const useCase = makeUpdateOrderUseCase(updateOrderRepository)
    return useCase
}
