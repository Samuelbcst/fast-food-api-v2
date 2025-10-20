import { PrismaFindPaymentByOrderIdOutputPort } from "./find-payment-by-order-id-repository"

export const makeFindPaymentByOrderIdRepository = async () =>
    new PrismaFindPaymentByOrderIdOutputPort()
