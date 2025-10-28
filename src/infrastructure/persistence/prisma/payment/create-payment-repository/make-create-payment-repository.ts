import { PrismaCreatePaymentOutputPort } from "./create-payment-repository"

export const makeCreatePaymentOutputPort = async () => {
    return new PrismaCreatePaymentOutputPort()
}

// Backwards-compatible alias used by tests / older makers
export const makeCreatePaymentRepository = makeCreatePaymentOutputPort
