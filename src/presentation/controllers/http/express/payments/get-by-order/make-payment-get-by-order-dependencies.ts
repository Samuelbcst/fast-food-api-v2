import { makeFindPaymentByOrderIdOutputPort } from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import { makeFindPaymentByOrderIdUseCase } from "@application/use-cases/payment/find-payment-by-order-id/make-find-payment-by-order-id-use-case"

export const makeGetPaymentByOrderFactory = async () => {
    const repository = await makeFindPaymentByOrderIdOutputPort()
    return makeFindPaymentByOrderIdUseCase(repository)
}
