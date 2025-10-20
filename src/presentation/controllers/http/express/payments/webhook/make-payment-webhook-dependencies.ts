import { makeFindOrderByIdRepository } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeUpdateOrderStatusRepository } from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import { makeFindPaymentByOrderIdRepository } from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import { makeUpdatePaymentRepository } from "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository"
import { makeUpdateOrderStatusUseCase } from "@use-cases/order/update-order-status/make-update-order-status-use-case"
import { makeProcessPaymentWebhookUseCase } from "@use-cases/payment/process-payment-webhook/make-process-payment-webhook-use-case"

export const makePaymentWebhookFactory = async () => {
    const paymentFinder = await makeFindPaymentByOrderIdRepository()
    const paymentUpdater = await makeUpdatePaymentRepository()
    const orderStatusRepository = await makeUpdateOrderStatusRepository()
    const orderFinder = await makeFindOrderByIdRepository()
    const paymentStatusFinder = await makeFindPaymentByOrderIdRepository()
    const orderStatusUseCase = makeUpdateOrderStatusUseCase(
        orderStatusRepository,
        orderFinder,
        paymentStatusFinder
    )

    return makeProcessPaymentWebhookUseCase(
        paymentFinder,
        paymentUpdater,
        orderStatusUseCase
    )
}
