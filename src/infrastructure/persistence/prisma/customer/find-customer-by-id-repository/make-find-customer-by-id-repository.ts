import { PrismaFindCustomerByIdRepository } from "./find-customer-by-id-repository"

export const makeFindCustomerByIdRepository = async () => {
    return new PrismaFindCustomerByIdRepository()
}
