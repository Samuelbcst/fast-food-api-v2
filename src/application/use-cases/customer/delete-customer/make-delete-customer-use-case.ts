import { DeleteCustomerInputPort } from "@application/ports/input/customer/delete-customer-input"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { DeleteCustomerOutputPort } from "@application/ports/output/customer/delete-customer-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { DeleteCustomerUseCase } from "."

/**
 * Factory for DeleteCustomerUseCase (UPDATED for Rich Domain Model)
 *
 * Now injects:
 * - FindCustomerByIdOutputPort: For loading existing customer entity
 * - EventDispatcher: For dispatching domain events after deletion
 * - Repository: For persistence
 */
export const makeDeleteCustomerUseCase = (
    repository: DeleteCustomerOutputPort,
    findCustomerRepository: FindCustomerByIdOutputPort,
    eventDispatcher: EventDispatcher
): DeleteCustomerInputPort => new DeleteCustomerUseCase(repository, findCustomerRepository, eventDispatcher)
