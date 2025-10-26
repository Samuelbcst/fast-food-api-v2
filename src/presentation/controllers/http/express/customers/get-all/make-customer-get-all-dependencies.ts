import { makeFindCustomerAllRepository } from "@persistence/prisma/customer/find-customer-all-repository/make-find-customer-all-repository"
import { makeFindCustomerAllUseCase } from "@application/use-cases/customer/find-customer-all/make-find-customer-all-use-case"

export const makeGetCustomerAllFactory = async () => {
    const repository = await makeFindCustomerAllRepository()
    const useCase = makeFindCustomerAllUseCase(repository)
    return useCase
}
