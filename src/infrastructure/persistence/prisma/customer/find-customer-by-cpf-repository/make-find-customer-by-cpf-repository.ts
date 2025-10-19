import { PrismaFindCustomerByCpfRepository } from "./find-customer-by-cpf-repository"

export const makeFindCustomerByCpfRepository = async () => {
    return new PrismaFindCustomerByCpfRepository()
}
