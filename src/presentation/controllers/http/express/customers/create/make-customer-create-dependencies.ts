import { makeCreateCustomerRepository } from "@persistence/prisma/customer/create-customer-repository/make-create-customer-repository"
import { makeCreateCustomerUseCase } from "@application/use-cases/customer/create-customer/make-create-customer-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"
import { UuidServicesImpl } from "@infrastructure/services/UuidServicesImpl"

export const makeCreateCustomerFactory = async () => {
    const repository = await makeCreateCustomerRepository()
    const uuidService = new UuidServicesImpl()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeCreateCustomerUseCase(repository, uuidService, eventDispatcher)
    return useCase
}
