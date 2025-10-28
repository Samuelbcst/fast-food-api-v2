import { ProcessPaymentWebhookInputPort } from "@application/ports/input/payment/process-payment-webhook-input"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { ProcessPaymentWebhookUseCase } from "."

/**
 * Factory for ProcessPaymentWebhookUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindPaymentByOrderIdOutputPort: For loading existing payment entity
 * - UpdatePaymentOutputPort: For persisting payment changes
 * - UpdateOrderStatusInputPort: For orchestrating order status after payment approval
 * - EventDispatcher: For dispatching domain events (PaymentApprovedEvent, PaymentRejectedEvent)
 */
export const makeProcessPaymentWebhookUseCase = (
    paymentFinder: FindPaymentByOrderIdOutputPort,
    paymentUpdater: UpdatePaymentOutputPort,
    orderStatusUseCase: UpdateOrderStatusInputPort,
    eventDispatcher: EventDispatcher
): ProcessPaymentWebhookInputPort =>
    new ProcessPaymentWebhookUseCase(
        paymentFinder,
        paymentUpdater,
        orderStatusUseCase,
        eventDispatcher
    )
