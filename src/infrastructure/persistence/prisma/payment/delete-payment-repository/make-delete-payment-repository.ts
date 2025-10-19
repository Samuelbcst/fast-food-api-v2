import { PrismaDeletePaymentOutputPort } from "./delete-payment-repository"

export const makeDeletePaymentOutputPort = async () => {
    return new PrismaDeletePaymentOutputPort()
}
