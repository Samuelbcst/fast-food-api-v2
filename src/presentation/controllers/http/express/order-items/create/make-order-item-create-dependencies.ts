import { makeCreateOrderItemRepository } from "@persistence/prisma/order-item/create-order-item-repository/make-create-order-item-repository"
import { makeCreateOrderItemUseCase } from "@application/use-cases/order-item/create-order-item/make-create-order-item-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"
import { UuidServicesImpl } from "@infrastructure/services/UuidServicesImpl"

export const makeCreateOrderItemFactory = async () => {
    const repository = await makeCreateOrderItemRepository()
    const uuidService = new UuidServicesImpl()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeCreateOrderItemUseCase(repository, uuidService, eventDispatcher)
    return useCase
}
