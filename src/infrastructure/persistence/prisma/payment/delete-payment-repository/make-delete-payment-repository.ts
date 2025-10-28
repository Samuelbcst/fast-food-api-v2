import { PrismaDeletePaymentOutputPort } from "./delete-payment-repository"

export const makeDeletePaymentOutputPort = async () => {
    return new PrismaDeletePaymentOutputPort()
}

// Backwards-compatible alias
export const makeDeletePaymentRepository = makeDeletePaymentOutputPort
