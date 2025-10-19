import { PrismaFindCustomerAllRepository } from "./find-customer-all-repository"

export const makeFindCustomerAllRepository = async () => {
    return new PrismaFindCustomerAllRepository()
}
