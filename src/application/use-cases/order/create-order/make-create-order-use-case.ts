import { CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { UnitOfWork } from "@application/ports/output/unit-of-work"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { CreateOrderUseCase } from "."

/**
 * Factory for CreateOrderUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - UUIDService: For generating domain entity IDs
 * - EventDispatcher: For dispatching domain events after persistence
 * - UnitOfWork: For transaction management
 * - Repositories: For persistence
 */
export const makeCreateOrderUseCase = (
    repository: CreateOrderOutputPort,
    productRepository: FindProductByIdOutputPort,
    uuidService: UUIDService,
    eventDispatcher: EventDispatcher,
    unitOfWork?: UnitOfWork
): CreateOrderInputPort =>
    new CreateOrderUseCase(
        repository,
        productRepository,
        unitOfWork ?? {
            // Lightweight default UnitOfWork for tests / quick wiring during migration.
            begin: async () => undefined,
            commit: async () => undefined,
            rollback: async () => undefined,
            execute: async <T>(operation: () => Promise<T>) => {
                return operation()
            },
            isInTransaction: () => false,
        },
        uuidService,
        eventDispatcher
    )
