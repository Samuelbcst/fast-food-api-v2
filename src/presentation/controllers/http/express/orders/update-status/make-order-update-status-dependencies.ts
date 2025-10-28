import { makeFindOrderByIdOutputPort } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeUpdateOrderStatusOutputPort } from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import { makeFindPaymentByOrderIdOutputPort } from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import { makeUpdateOrderStatusUseCase } from "@application/use-cases/order/update-order-status/make-update-order-status-use-case"
import { InMemoryEventDispatcher } from "@infrastructure/events/in-memory-event-dispatcher"

export const makeUpdateOrderStatusFactory = async () => {
    const repository = await makeUpdateOrderStatusOutputPort()
    const findOrderRepo = await makeFindOrderByIdOutputPort()
    const findPaymentRepo = await makeFindPaymentByOrderIdOutputPort()
    const eventDispatcher = new InMemoryEventDispatcher()
    const useCase = makeUpdateOrderStatusUseCase(
        repository,
        findOrderRepo,
        findPaymentRepo,
        eventDispatcher
    )
    return useCase
}
