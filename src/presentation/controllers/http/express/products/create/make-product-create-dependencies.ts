import { makeCreateProductRepository } from "@persistence/prisma/product/create-product-repository/make-create-product-repository"
import { makeCreateProductUseCase } from "@application/use-cases/product/create-product/make-create-product-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"
import { UuidServicesImpl } from "@infrastructure/services/UuidServicesImpl"

export const makeCreateProductFactory = async () => {
    const repository = await makeCreateProductRepository()
    const uuidService = new UuidServicesImpl()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeCreateProductUseCase(repository, uuidService, eventDispatcher)
    return useCase
}
