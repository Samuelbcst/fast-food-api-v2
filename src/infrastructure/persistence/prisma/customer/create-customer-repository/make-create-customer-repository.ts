import { PrismaCreateCustomerRepository } from "./create-customer-repository"

export const makeCreateCustomerRepository = async () => {
    return new PrismaCreateCustomerRepository()
}
