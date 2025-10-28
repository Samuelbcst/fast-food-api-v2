import { UpdateProductInputPort } from "@application/ports/input/product/update-product-input"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { UpdateProductOutputPort } from "@application/ports/output/product/update-product-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { UpdateProductUseCase } from "."

/**
 * Factory for UpdateProductUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindProductByIdOutputPort: For loading existing product entity
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeUpdateProductUseCase = (
    repository: UpdateProductOutputPort,
    findProductRepository: FindProductByIdOutputPort,
    eventDispatcher: EventDispatcher
): UpdateProductInputPort => new UpdateProductUseCase(repository, findProductRepository, eventDispatcher)
