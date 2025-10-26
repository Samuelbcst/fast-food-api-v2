import { makeFindOrderByIdOutputPort } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeCreatePaymentOutputPort } from "@persistence/prisma/payment/create-payment-repository/make-create-payment-repository"
import { makeCreatePaymentUseCase } from "@application/use-cases/payment/create-payment/make-create-payment-use-case"

export const makeCreatePaymentFactory = async () => {
    const paymentRepository = await makeCreatePaymentOutputPort()
    const orderRepository = await makeFindOrderByIdOutputPort()
    const useCase = makeCreatePaymentUseCase(paymentRepository, orderRepository)
    return useCase
}
