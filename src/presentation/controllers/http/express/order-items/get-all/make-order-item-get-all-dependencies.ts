import { makeFindOrderItemAllOutputPort } from "@persistence/prisma/order-item/find-order-item-all-repository/make-find-order-item-all-repository"
import { makeFindOrderItemAllUseCase } from "@application/use-cases/order-item/find-order-item-all/make-find-order-item-all-use-case"

export const makeGetOrderItemAllFactory = async () => {
    const repository = await makeFindOrderItemAllOutputPort()
    const useCase = makeFindOrderItemAllUseCase(repository)
    return useCase
}
