import {
    CreateCategoryCommand,
    CreateCategoryInputPort,
} from "@application/ports/input/category/create-category-input"
import { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { UUIDService } from "@domain/services/UUIDService"
import { Category } from "@entities/category/category"

/**
 * Create Category Use Case
 *
 * This use case demonstrates the complete flow of Clean Architecture with Domain Events:
 * 1. Create a domain entity (Category)
 * 2. The entity raises a domain event (CategoryCreatedEvent)
 * 3. Save the entity to the database
 * 4. Dispatch all domain events to registered handlers
 * 5. Clear events from the entity
 */
export class CreateCategoryUseCase implements CreateCategoryInputPort {
    constructor(
        private createCategoryOutputPort: CreateCategoryOutputPort,
        private uuidService: UUIDService,
        private eventDispatcher: EventDispatcher
    ) {}

    async execute(input: CreateCategoryCommand) {
        try {
            // Step 1: Create the domain entity
            // The 'true' parameter tells the entity to raise a CategoryCreatedEvent
            const id = this.uuidService.generate()
            const category = new Category(
                id.toString(),
                input.name,
                input.description,
                true // raiseEvent = true
            )

            // Step 2: Save the entity to the database
            const created = await this.createCategoryOutputPort.create(category)

            // Step 3: Dispatch all domain events
            // This is where the magic happens! All registered event handlers
            // will be called asynchronously
            const domainEvents = created.getDomainEvents()
            if (domainEvents.length > 0) {
                console.log(
                    `[CreateCategoryUseCase] Dispatching ${domainEvents.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(domainEvents)
            }

            // Step 4: Clear events from the entity
            // This prevents events from being dispatched multiple times
            created.clearDomainEvents()

            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to create category",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createCategoryOutputPort.finish()
    }
}

