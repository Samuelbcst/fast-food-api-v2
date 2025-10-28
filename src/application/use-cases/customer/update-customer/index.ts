import { UpdateCustomerCommand, UpdateCustomerInputPort } from "@application/ports/input/customer/update-customer-input"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { UpdateCustomerOutputPort } from "@application/ports/output/customer/update-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { CustomerDomainError } from "@entities/customer/customer"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Update Customer Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Calling domain methods (updateName, updateEmail) instead of direct mutation
 * 3. Domain entity validates business rules
 * 4. Domain raises events automatically (CustomerUpdatedEvent)
 * 5. Events dispatched after successful persistence
 *
 * Changes from anemic version:
 * - Load existing customer entity first
 * - Call domain methods (updateName, updateEmail)
 * - Domain raises CustomerUpdatedEvent
 * - Use case dispatches events after persistence
 */
export class UpdateCustomerUseCase implements UpdateCustomerInputPort {
    constructor(
        private readonly updateCustomerOutputPort: UpdateCustomerOutputPort,
        private readonly findCustomerByIdOutputPort: FindCustomerByIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: UpdateCustomerCommand) {
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

            // Step 2: Call domain methods (not direct mutation!)
            // Domain entity will:
            // - Validate business rules (email format, name not empty)
            // - Raise CustomerUpdatedEvent
            // - Throw CustomerDomainError if validation fails
            try {
                if (input.name) {
                    currentCustomer.updateName(input.name)
                }

                if (input.email) {
                    currentCustomer.updateEmail(input.email)
                }
            } catch (error) {
                if (error instanceof CustomerDomainError) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(error.message, 400),
                    }
                }
                throw error
            }

            // Step 3: Persist the updated customer
            const updatedCustomer = await this.updateCustomerOutputPort.execute({
                id: input.id,
                name: input.name,
                email: input.email,
                cpf: input.cpf,
            })

            if (!updatedCustomer) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Customer not found.", 404),
                }
            }

            // Step 4: Dispatch domain events
            const events = currentCustomer.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[UpdateCustomerUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 5: Clear events
            currentCustomer.clearDomainEvents()

            return {
                success: true,
                result: updatedCustomer,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to update customer",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.updateCustomerOutputPort.finish(),
            this.findCustomerByIdOutputPort.finish(),
        ])
    }
}
