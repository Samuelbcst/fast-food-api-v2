import { makeFindOrderByStatusRepository } from "@persistence/prisma/order/find-order-by-status-repository/make-find-order-by-status-repository"
import { makeFindOrderByStatusUseCase } from "@use-cases/order/find-order-by-status/make-find-order-by-status-use-case"

export const makeGetOrderByStatusFactory = async () => {
    const repository = await makeFindOrderByStatusRepository()
    const useCase = makeFindOrderByStatusUseCase(repository)
    return useCase
}
