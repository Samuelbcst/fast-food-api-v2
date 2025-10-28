import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { UpdateOrderStatusUseCase } from "."

/**
 * Factory for UpdateOrderStatusUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindOrderByIdOutputPort: For loading existing order entity
 * - FindPaymentByOrderIdOutputPort: For payment validation business rule
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeUpdateOrderStatusUseCase = (
    repository: UpdateOrderStatusOutputPort,
    findOrderByIdRepository: FindOrderByIdOutputPort,
    findPaymentByOrderIdRepository: FindPaymentByOrderIdOutputPort,
    eventDispatcher: EventDispatcher
): UpdateOrderStatusInputPort =>
    new UpdateOrderStatusUseCase(
        repository,
        findOrderByIdRepository,
        findPaymentByOrderIdRepository,
        eventDispatcher
    )
