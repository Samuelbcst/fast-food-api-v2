import { CreateOrderItemInputPort } from "@application/ports/input/order-item/create-order-item-input"
import { CreateOrderItemOutputPort } from "@application/ports/output/order-item/create-order-item-output-port"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { CreateOrderItemUseCase } from "."

/**
 * Factory for CreateOrderItemUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - UUIDService: For generating domain entity IDs
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeCreateOrderItemUseCase = (
    repository: CreateOrderItemOutputPort,
    uuidService: UUIDService,
    eventDispatcher: EventDispatcher
): CreateOrderItemInputPort => new CreateOrderItemUseCase(repository, uuidService, eventDispatcher)
