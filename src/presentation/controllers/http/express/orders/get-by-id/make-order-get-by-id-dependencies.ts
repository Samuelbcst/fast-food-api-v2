import { makeFindOrderByIdOutputPort } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeFindOrderByIdUseCase } from "@application/use-cases/order/find-order-by-id/make-find-order-by-id-use-case"

export const makeGetOrderByIdFactory = async () => {
    const repository = await makeFindOrderByIdOutputPort()
    const useCase = makeFindOrderByIdUseCase(repository)
    return useCase
}
