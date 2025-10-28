import { PrismaFindPaymentAllOutputPort } from "./find-payment-all-repository"

export const makeFindPaymentAllOutputPort = async () => {
    return new PrismaFindPaymentAllOutputPort()
}

// Backwards-compatible alias
export const makeFindPaymentAllRepository = makeFindPaymentAllOutputPort
