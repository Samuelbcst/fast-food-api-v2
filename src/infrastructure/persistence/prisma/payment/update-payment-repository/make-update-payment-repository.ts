import { PrismaUpdatePaymentOutputPort } from "./update-payment-repository"

export const makeUpdatePaymentOutputPort = async () => {
    return new PrismaUpdatePaymentOutputPort()
}

// Deprecated: use makeUpdatePaymentOutputPort
export const makeUpdatePaymentRepository = makeUpdatePaymentOutputPort
