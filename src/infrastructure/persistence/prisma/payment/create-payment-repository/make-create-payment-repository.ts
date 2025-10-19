import { PrismaCreatePaymentOutputPort } from "./create-payment-repository"

export const makeCreatePaymentOutputPort = async () => {
    return new PrismaCreatePaymentOutputPort()
}
