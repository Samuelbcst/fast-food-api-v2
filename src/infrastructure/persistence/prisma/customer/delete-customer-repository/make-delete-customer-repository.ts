import { PrismaDeleteCustomerRepository } from "./delete-customer-repository"

export const makeDeleteCustomerRepository = async () => {
    return new PrismaDeleteCustomerRepository()
}
