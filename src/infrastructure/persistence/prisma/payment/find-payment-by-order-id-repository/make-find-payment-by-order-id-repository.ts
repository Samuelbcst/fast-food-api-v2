import { PrismaFindPaymentByOrderIdOutputPort } from "./find-payment-by-order-id-repository"

export const makeFindPaymentByOrderIdOutputPort = async () =>
    new PrismaFindPaymentByOrderIdOutputPort()
