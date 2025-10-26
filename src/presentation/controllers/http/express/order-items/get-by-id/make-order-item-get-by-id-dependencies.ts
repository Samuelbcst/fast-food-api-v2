import { makeFindOrderItemByIdOutputPort } from "@persistence/prisma/order-item/find-order-item-by-id-repository/make-find-order-item-by-id-repository"
import { makeFindOrderItemByIdUseCase } from "@application/use-cases/order-item/find-order-item-by-id/make-find-order-item-by-id-use-case"

export const makeGetOrderItemByIdFactory = async () => {
    const repository = await makeFindOrderItemByIdOutputPort()
    const useCase = makeFindOrderItemByIdUseCase(repository)
    return useCase
}
