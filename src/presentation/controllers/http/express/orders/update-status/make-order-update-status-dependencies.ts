import { makeUpdateOrderStatusRepository } from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import { makeUpdateOrderStatusUseCase } from "@use-cases/order/update-order-status/make-update-order-status-use-case"

export const makeUpdateOrderStatusFactory = async () => {
    const repository = await makeUpdateOrderStatusRepository()
    const useCase = makeUpdateOrderStatusUseCase(repository)
    return useCase
}
