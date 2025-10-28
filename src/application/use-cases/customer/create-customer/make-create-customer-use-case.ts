import { CreateCustomerInputPort } from "@application/ports/input/customer/create-customer-input"
import { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { CreateCustomerUseCase } from "."

/**
 * Factory for CreateCustomerUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - UUIDService: For generating domain entity IDs
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeCreateCustomerUseCase = (
    repository: CreateCustomerOutputPort,
    uuidService: UUIDService,
    eventDispatcher: EventDispatcher
): CreateCustomerInputPort => new CreateCustomerUseCase(repository, uuidService, eventDispatcher)
