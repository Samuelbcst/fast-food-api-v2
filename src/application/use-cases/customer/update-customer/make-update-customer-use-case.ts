import { UpdateCustomerInputPort } from "@application/ports/input/customer/update-customer-input"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { UpdateCustomerOutputPort } from "@application/ports/output/customer/update-customer-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { UpdateCustomerUseCase } from "."

/**
 * Factory for UpdateCustomerUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindCustomerByIdOutputPort: For loading existing customer entity
 * - EventDispatcher: For dispatching domain events after persistence
 * - Repository: For persistence
 */
export const makeUpdateCustomerUseCase = (
    repository: UpdateCustomerOutputPort,
    findCustomerRepository: FindCustomerByIdOutputPort,
    eventDispatcher: EventDispatcher
): UpdateCustomerInputPort => new UpdateCustomerUseCase(repository, findCustomerRepository, eventDispatcher)
