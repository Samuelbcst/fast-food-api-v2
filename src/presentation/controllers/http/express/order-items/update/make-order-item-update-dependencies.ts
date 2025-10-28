import { makeUpdateOrderItemOutputPort } from "@persistence/prisma/order-item/update-order-item-repository/make-update-order-item-repository"
import { makeFindOrderItemByIdOutputPort } from "@persistence/prisma/order-item/find-order-item-by-id-repository/make-find-order-item-by-id-repository"
import { makeUpdateOrderItemUseCase } from "@application/use-cases/order-item/update-order-item/make-update-order-item-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeUpdateOrderItemFactory = async () => {
    const repository = await makeUpdateOrderItemOutputPort()
    const findRepository = await makeFindOrderItemByIdOutputPort()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeUpdateOrderItemUseCase(repository, findRepository, eventDispatcher)
    return useCase
}
