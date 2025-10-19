import { PrismaUpdateCustomerRepository } from "./update-customer-repository"

export const makeUpdateCustomerRepository = async () => {
    return new PrismaUpdateCustomerRepository()
}
