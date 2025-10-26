import { makeFindOrderAllOutputPort } from "@persistence/prisma/order/find-order-all-repository/make-find-order-all-repository"
import { makeFindOrderAllUseCase } from "@application/use-cases/order/find-order-all/make-find-order-all-use-case"

export const makeGetOrderAllFactory = async () => {
    const repository = await makeFindOrderAllOutputPort()
    const useCase = makeFindOrderAllUseCase(repository)
    return useCase
}
