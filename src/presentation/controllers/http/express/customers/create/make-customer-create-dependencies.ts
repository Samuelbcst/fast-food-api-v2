import { makeCreateCustomerRepository } from "@persistence/prisma/customer/create-customer-repository/make-create-customer-repository"
import { makeCreateCustomerUseCase } from "@use-cases/customer/create-customer/make-create-customer-use-case"

export const makeCreateCustomerFactory = async () => {
    const repository = await makeCreateCustomerRepository()
    const useCase = makeCreateCustomerUseCase(repository)
    return useCase
}
