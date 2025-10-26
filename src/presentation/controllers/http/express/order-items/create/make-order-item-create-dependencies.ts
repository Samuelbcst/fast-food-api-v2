import { makeCreateOrderItemOutputPort } from "@persistence/prisma/order-item/create-order-item-repository/make-create-order-item-repository"
import { makeCreateOrderItemUseCase } from "@application/use-cases/order-item/create-order-item/make-create-order-item-use-case"

export const makeCreateOrderItemFactory = async () => {
    const repository = await makeCreateOrderItemOutputPort()
    const useCase = makeCreateOrderItemUseCase(repository)
    return useCase
}
