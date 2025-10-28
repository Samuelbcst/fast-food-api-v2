import { PrismaFindPaymentByOrderIdOutputPort } from "./find-payment-by-order-id-repository"

export const makeFindPaymentByOrderIdOutputPort = async () => {
    return new PrismaFindPaymentByOrderIdOutputPort()
}

// Backwards-compatible alias
export const makeFindPaymentByOrderIdRepository = makeFindPaymentByOrderIdOutputPort
