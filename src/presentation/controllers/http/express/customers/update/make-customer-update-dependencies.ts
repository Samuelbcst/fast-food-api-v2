import { makeUpdateCustomerRepository } from "@persistence/prisma/customer/update-customer-repository/make-update-customer-repository"
import { makeFindCustomerByIdRepository } from "@persistence/prisma/customer/find-customer-by-id-repository/make-find-customer-by-id-repository"
import { makeUpdateCustomerUseCase } from "@application/use-cases/customer/update-customer/make-update-customer-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeUpdateCustomerFactory = async () => {
    const repository = await makeUpdateCustomerRepository()
    const findRepository = await makeFindCustomerByIdRepository()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeUpdateCustomerUseCase(repository, findRepository, eventDispatcher)
    return useCase
}
