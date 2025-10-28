import { makeDeleteOrderItemOutputPort } from "@persistence/prisma/order-item/delete-order-item-repository/make-delete-order-item-repository"
import { makeFindOrderItemByIdOutputPort } from "@persistence/prisma/order-item/find-order-item-by-id-repository/make-find-order-item-by-id-repository"
import { makeDeleteOrderItemUseCase } from "@application/use-cases/order-item/delete-order-item/make-delete-order-item-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeDeleteOrderItemFactory = async () => {
    const repository = await makeDeleteOrderItemOutputPort()
    const findRepository = await makeFindOrderItemByIdOutputPort()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeDeleteOrderItemUseCase(repository, findRepository, eventDispatcher)
    return useCase
}
