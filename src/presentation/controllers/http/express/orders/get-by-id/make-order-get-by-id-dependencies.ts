import { makeFindOrderByIdRepository } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeFindOrderByIdUseCase } from "@use-cases/order/find-order-by-id/make-find-order-by-id-use-case"

export const makeGetOrderByIdFactory = async () => {
    const repository = await makeFindOrderByIdRepository()
    const useCase = makeFindOrderByIdUseCase(repository)
    return useCase
}
