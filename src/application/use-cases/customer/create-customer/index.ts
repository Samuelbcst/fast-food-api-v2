import { CreateCustomerCommand, CreateCustomerInputPort } from "@application/ports/input/customer/create-customer-input"
import { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { Customer, CustomerDomainError } from "@entities/customer/customer"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Create Customer Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Creating Customer domain entity using domain constructor
 * 2. Domain entity validates business rules (email format, CPF format, name not empty)
 * 3. Domain raises CustomerCreatedEvent automatically
 * 4. Events dispatched after successful persistence
 * 5. Use case orchestrates, domain enforces business rules
 *
 * Changes from anemic version:
 * - Domain entity now validates its own data (email, CPF, name)
 * - Business logic moved from use case to domain
 * - Events dispatched after persistence
 * - UUIDService generates IDs (not database)
 */
export class CreateCustomerUseCase implements CreateCustomerInputPort {
    constructor(
        private readonly createCustomerOutputPort: CreateCustomerOutputPort,
        private readonly uuidService: UUIDService,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: CreateCustomerCommand) {
        try {
            // Step 1: Create Customer domain entity
            // Domain entity will:
            // - Validate name (not empty, min length)
            // - Validate email format
            // - Validate CPF format (via CPF value object)
            // - Raise CustomerCreatedEvent
            // - Throw CustomerDomainError if validation fails
            const customerId = this.uuidService.generate()

            let customer: Customer
            try {
                customer = new Customer(
                    customerId,
                    input.name,
                    input.email,
                    input.cpf,
                    true // raiseEvent = true (this is a NEW customer)
                )
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

            // Step 2: Persist the customer
            // Repository adapts between domain (string ID) and infrastructure (number ID)
            const created = await this.createCustomerOutputPort.create({
                name: customer.name,
                email: customer.email,
                cpf: customer.cpf, // CPF is already a string in Customer entity
            } as any)

            // Step 3: Dispatch domain events
            // Events raised by: Customer constructor (CustomerCreatedEvent)
            const events = customer.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[CreateCustomerUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 4: Clear events after dispatching
            customer.clearDomainEvents()

            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            // If error is CustomerDomainError, preserve the validation message
            if (error instanceof CustomerDomainError) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(error.message, 400),
                }
            }

            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to create customer",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createCustomerOutputPort.finish()
    }
}
