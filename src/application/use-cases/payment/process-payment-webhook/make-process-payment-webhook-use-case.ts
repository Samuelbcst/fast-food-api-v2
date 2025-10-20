import { ProcessPaymentWebhookInputPort } from "@application/ports/input/payment/process-payment-webhook-input"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"

import { ProcessPaymentWebhookUseCase } from "."

export const makeProcessPaymentWebhookUseCase = (
    paymentFinder: FindPaymentByOrderIdOutputPort,
    paymentUpdater: UpdatePaymentOutputPort,
    orderStatusUseCase: UpdateOrderStatusInputPort
): ProcessPaymentWebhookInputPort =>
    new ProcessPaymentWebhookUseCase(
        paymentFinder,
        paymentUpdater,
        orderStatusUseCase
    )
