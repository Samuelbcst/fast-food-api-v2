import { PrismaFindPaymentByIdOutputPort } from "./find-payment-by-id-repository"

export const makeFindPaymentByIdOutputPort = async () => {
    return new PrismaFindPaymentByIdOutputPort()
}

// Backwards-compatible alias
export const makeFindPaymentByIdRepository = makeFindPaymentByIdOutputPort
