import { PrismaUpdatePaymentOutputPort } from "./update-payment-repository"

export const makeUpdatePaymentRepository = async () => {
    return new PrismaUpdatePaymentOutputPort()
}

export const makeUpdatePaymentOutputPort = makeUpdatePaymentRepository
