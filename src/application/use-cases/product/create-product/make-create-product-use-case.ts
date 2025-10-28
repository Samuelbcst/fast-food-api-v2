import { CreateProductInputPort } from "@application/ports/input/product/create-product-input"
import { CreateProductOutputPort } from "@application/ports/output/product/create-product-output-port"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { CreateProductUseCase } from "."

/**
 * Factory for CreateProductUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - UUIDService: For generating domain entity IDs
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeCreateProductUseCase = (
    repository: CreateProductOutputPort,
    uuidService: UUIDService,
    eventDispatcher: EventDispatcher
): CreateProductInputPort => new CreateProductUseCase(repository, uuidService, eventDispatcher)
