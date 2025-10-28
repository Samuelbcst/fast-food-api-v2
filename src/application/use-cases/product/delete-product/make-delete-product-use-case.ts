import { DeleteProductInputPort } from "@application/ports/input/product/delete-product-input"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { DeleteProductOutputPort } from "@application/ports/output/product/delete-product-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { DeleteProductUseCase } from "."

/**
 * Factory for DeleteProductUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindProductByIdOutputPort: For loading existing product entity
 * - EventDispatcher: For dispatching domain events after deletion
 * - Repository: For persistence
 */
export const makeDeleteProductUseCase = (
    repository: DeleteProductOutputPort,
    findProductRepository: FindProductByIdOutputPort,
    eventDispatcher: EventDispatcher
): DeleteProductInputPort => new DeleteProductUseCase(repository, findProductRepository, eventDispatcher)
