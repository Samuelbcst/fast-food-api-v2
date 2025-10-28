import { UpdateOrderItemInputPort } from "@application/ports/input/order-item/update-order-item-input"
import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { UpdateOrderItemOutputPort } from "@application/ports/output/order-item/update-order-item-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { UpdateOrderItemUseCase } from "."

/**
 * Factory for UpdateOrderItemUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindOrderItemByIdOutputPort: For loading existing order item entity
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeUpdateOrderItemUseCase = (
    repository: UpdateOrderItemOutputPort,
    findOrderItemRepository: FindOrderItemByIdOutputPort,
    eventDispatcher: EventDispatcher
): UpdateOrderItemInputPort => new UpdateOrderItemUseCase(repository, findOrderItemRepository, eventDispatcher)
