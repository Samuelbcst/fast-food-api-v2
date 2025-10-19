import { makeUpdateCustomerRepository } from "@persistence/prisma/customer/update-customer-repository/make-update-customer-repository"
import { makeUpdateCustomerUseCase } from "@use-cases/customer/update-customer/make-update-customer-use-case"

export const makeUpdateCustomerFactory = async () => {
    const updateCustomerRepository = await makeUpdateCustomerRepository()
    const useCase = makeUpdateCustomerUseCase(updateCustomerRepository)
    return useCase
}
