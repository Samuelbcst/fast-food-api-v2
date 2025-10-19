import { makeFindCustomerByIdRepository } from "@persistence/prisma/customer/find-customer-by-id-repository/make-find-customer-by-id-repository"
import { makeFindCustomerByIdUseCase } from "@use-cases/customer/find-customer-by-id/make-find-customer-by-id-use-case"

export const makeGetCustomerByIdFactory = async () => {
    const repository = await makeFindCustomerByIdRepository()
    const useCase = makeFindCustomerByIdUseCase(repository)
    return useCase
}
