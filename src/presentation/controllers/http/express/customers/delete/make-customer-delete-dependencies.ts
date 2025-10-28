import { makeDeleteCustomerRepository } from "@persistence/prisma/customer/delete-customer-repository/make-delete-customer-repository"
import { makeFindCustomerByIdRepository } from "@persistence/prisma/customer/find-customer-by-id-repository/make-find-customer-by-id-repository"
import { makeDeleteCustomerUseCase } from "@application/use-cases/customer/delete-customer/make-delete-customer-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeDeleteCustomerFactory = async () => {
    const repository = await makeDeleteCustomerRepository()
    const findRepository = await makeFindCustomerByIdRepository()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeDeleteCustomerUseCase(repository, findRepository, eventDispatcher)
    return useCase
}
