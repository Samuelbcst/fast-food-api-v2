import { PrismaFindOrderByCustomerOutputPort } from "./find-order-by-customer-repository"

export const makeFindOrderByCustomerOutputPort = async () => {
    return new PrismaFindOrderByCustomerOutputPort()
}

// Backwards-compatible alias
export const makeFindOrderByCustomerRepository = makeFindOrderByCustomerOutputPort
