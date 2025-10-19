import { PrismaFindPaymentAllOutputPort } from "./find-payment-all-repository"

export const makeFindPaymentAllOutputPort = async () => {
    return new PrismaFindPaymentAllOutputPort()
}
