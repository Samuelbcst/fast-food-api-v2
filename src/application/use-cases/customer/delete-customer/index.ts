import { DeleteCustomerCommand, DeleteCustomerInputPort } from "@application/ports/input/customer/delete-customer-input"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { DeleteCustomerOutputPort } from "@application/ports/output/customer/delete-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Delete Customer Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Verifying entity exists before deletion
 * 3. Domain raises CustomerDeletedEvent
 * 4. Events dispatched after successful deletion
 *
 * Changes from anemic version:
 * - Load existing customer entity first to verify it exists
 * - Raise CustomerDeletedEvent before deletion
 * - Use case dispatches events after persistence
 *
 * Note: In a more sophisticated domain model, we might add business rules
 * like "cannot delete customer if they have pending orders" - this would be
 * validated by a domain method like customer.canBeDeleted()
 */
export class DeleteCustomerUseCase implements DeleteCustomerInputPort {
    constructor(
        private readonly deleteCustomerOutputPort: DeleteCustomerOutputPort,
        private readonly findCustomerByIdOutputPort: FindCustomerByIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: DeleteCustomerCommand) {
        try {
            // Step 1: Load existing customer (domain entity)
            const currentCustomer = await this.findCustomerByIdOutputPort.execute(
                input.id
            )

            if (!currentCustomer) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Customer not found.", 404),
                }
            }

            // Step 2: Business rule validation (if needed)
            // In a more sophisticated model, we might check:
            // if (!currentCustomer.canBeDeleted()) {
            //     return {
            //         success: false,
            //         result: null,
            //         error: new CustomError("Customer cannot be deleted (has pending orders)", 400)
            //     }
            // }

            // Step 3: Raise deletion event
            // Note: We raise the event BEFORE deletion since we still have the entity data
            currentCustomer.raiseDeleteEvent()

            // Step 4: Delete from persistence
            const deleted = await this.deleteCustomerOutputPort.execute(input.id)

            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Customer not found.", 404),
                }
            }

            // Step 5: Dispatch domain events
            const events = currentCustomer.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[DeleteCustomerUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 6: Clear events
            currentCustomer.clearDomainEvents()

            return {
                success: true,
                result: deleted,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to delete customer",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.deleteCustomerOutputPort.finish(),
            this.findCustomerByIdOutputPort.finish(),
        ])
    }
}
