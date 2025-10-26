import { makeFindOrderByIdOutputPort } from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import { makeUpdateOrderStatusOutputPort } from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import { makeFindPaymentByOrderIdOutputPort } from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import { makeUpdatePaymentOutputPort } from "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository"
import { makeUpdateOrderStatusUseCase } from "@application/use-cases/order/update-order-status/make-update-order-status-use-case"
import { makeProcessPaymentWebhookUseCase } from "@application/use-cases/payment/process-payment-webhook/make-process-payment-webhook-use-case"

export const makePaymentWebhookFactory = async () => {
    const paymentFinder = await makeFindPaymentByOrderIdOutputPort()
    const paymentUpdater = await makeUpdatePaymentOutputPort()
    const orderStatusRepository = await makeUpdateOrderStatusOutputPort()
    const orderFinder = await makeFindOrderByIdOutputPort()
    const paymentStatusFinder = await makeFindPaymentByOrderIdOutputPort()
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
