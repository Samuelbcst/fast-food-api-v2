import { makeFindOrderByIdRepository } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeUpdateOrderStatusRepository } from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import { makeFindPaymentByOrderIdRepository } from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import { makeUpdateOrderStatusUseCase } from "@use-cases/order/update-order-status/make-update-order-status-use-case"

export const makeUpdateOrderStatusFactory = async () => {
    const repository = await makeUpdateOrderStatusRepository()
    const findOrderRepo = await makeFindOrderByIdRepository()
    const findPaymentRepo = await makeFindPaymentByOrderIdRepository()
    const useCase = makeUpdateOrderStatusUseCase(
        repository,
        findOrderRepo,
        findPaymentRepo
    )
    return useCase
}
