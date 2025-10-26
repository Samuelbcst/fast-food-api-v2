import { makeFindOrderByStatusOutputPort } from "@persistence/prisma/order/find-order-by-status-repository/make-find-order-by-status-repository"
import { makeFindOrderByStatusUseCase } from "@application/use-cases/order/find-order-by-status/make-find-order-by-status-use-case"

export const makeGetOrderByStatusFactory = async () => {
    const repository = await makeFindOrderByStatusOutputPort()
    const useCase = makeFindOrderByStatusUseCase(repository)
    return useCase
}
