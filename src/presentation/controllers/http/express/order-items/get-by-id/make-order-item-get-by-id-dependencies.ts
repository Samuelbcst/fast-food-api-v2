import { makeFindOrderItemByIdRepository } from "@persistence/prisma/order-item/find-order-item-by-id-repository/make-find-order-item-by-id-repository"
import { makeFindOrderItemByIdUseCase } from "@use-cases/order-item/find-order-item-by-id/make-find-order-item-by-id-use-case"

export const makeGetOrderItemByIdFactory = async () => {
    const repository = await makeFindOrderItemByIdRepository()
    const useCase = makeFindOrderItemByIdUseCase(repository)
    return useCase
}
