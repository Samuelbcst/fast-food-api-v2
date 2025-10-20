import { makeFindPaymentByOrderIdRepository } from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import { makeFindPaymentByOrderIdUseCase } from "@use-cases/payment/find-payment-by-order-id/make-find-payment-by-order-id-use-case"

export const makeGetPaymentByOrderFactory = async () => {
    const repository = await makeFindPaymentByOrderIdRepository()
    return makeFindPaymentByOrderIdUseCase(repository)
}
