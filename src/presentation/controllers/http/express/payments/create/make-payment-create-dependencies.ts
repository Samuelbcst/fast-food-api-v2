import { makeFindOrderByIdRepository } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeCreatePaymentRepository } from "@persistence/prisma/payment/create-payment-repository/make-create-payment-repository"
import { makeCreatePaymentUseCase } from "@use-cases/payment/create-payment/make-create-payment-use-case"

export const makeCreatePaymentFactory = async () => {
    const paymentRepository = await makeCreatePaymentRepository()
    const orderRepository = await makeFindOrderByIdRepository()
    const useCase = makeCreatePaymentUseCase(paymentRepository, orderRepository)
    return useCase
}
