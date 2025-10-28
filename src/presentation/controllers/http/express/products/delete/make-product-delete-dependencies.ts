import { makeDeleteProductRepository } from "@persistence/prisma/product/delete-product-repository/make-delete-product-repository"
import { makeFindProductByIdRepository } from "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository"
import { makeDeleteProductUseCase } from "@application/use-cases/product/delete-product/make-delete-product-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeDeleteProductFactory = async () => {
    const repository = await makeDeleteProductRepository()
    const findRepository = await makeFindProductByIdRepository()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeDeleteProductUseCase(repository, findRepository, eventDispatcher)
    return useCase
}
