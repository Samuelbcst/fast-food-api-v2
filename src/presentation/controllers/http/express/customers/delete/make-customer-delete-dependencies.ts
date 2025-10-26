import { makeDeleteCustomerRepository } from "@persistence/prisma/customer/delete-customer-repository/make-delete-customer-repository"
import { makeDeleteCustomerUseCase } from "@application/use-cases/customer/delete-customer/make-delete-customer-use-case"

export const makeDeleteCustomerFactory = async () => {
    const deleteCustomerRepository = await makeDeleteCustomerRepository()
    const useCase = makeDeleteCustomerUseCase(deleteCustomerRepository)
    return useCase
}
