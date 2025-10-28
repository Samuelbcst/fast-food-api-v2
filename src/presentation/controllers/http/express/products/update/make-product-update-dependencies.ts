import { makeUpdateProductRepository } from "@persistence/prisma/product/update-product-repository/make-update-product-repository"
import { makeFindProductByIdRepository } from "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository"
import { makeUpdateProductUseCase } from "@application/use-cases/product/update-product/make-update-product-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeUpdateProductFactory = async () => {
    const repository = await makeUpdateProductRepository()
    const findRepository = await makeFindProductByIdRepository()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeUpdateProductUseCase(repository, findRepository, eventDispatcher)
    return useCase
}
