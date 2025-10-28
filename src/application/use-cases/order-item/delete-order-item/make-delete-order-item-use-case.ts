import { DeleteOrderItemInputPort } from "@application/ports/input/order-item/delete-order-item-input"
import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { DeleteOrderItemOutputPort } from "@application/ports/output/order-item/delete-order-item-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { DeleteOrderItemUseCase } from "./index"

/**
 * Factory for DeleteOrderItemUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindOrderItemByIdOutputPort: For loading existing order item entity
 * - EventDispatcher: For dispatching domain events after deletion
 * - Repository: For persistence
 */
export const makeDeleteOrderItemUseCase = (
    repository: DeleteOrderItemOutputPort,
    findOrderItemRepository: FindOrderItemByIdOutputPort,
    eventDispatcher: EventDispatcher
): DeleteOrderItemInputPort => new DeleteOrderItemUseCase(repository, findOrderItemRepository, eventDispatcher)
