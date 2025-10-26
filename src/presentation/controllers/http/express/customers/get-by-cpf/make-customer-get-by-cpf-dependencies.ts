import { makeFindCustomerByCpfRepository } from "@persistence/prisma/customer/find-customer-by-cpf-repository/make-find-customer-by-cpf-repository"
import { FindCustomerByCpfUseCase } from "@application/use-cases/customer/find-customer-by-cpf"

export const makeGetCustomerByCpfFactory = async () => {
    const repository = await makeFindCustomerByCpfRepository()
    const useCase = new FindCustomerByCpfUseCase(repository)
    return useCase
}
