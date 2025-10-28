import { CreateProductCommand, CreateProductInputPort } from "@application/ports/input/product/create-product-input"
import { CreateProductOutputPort } from "@application/ports/output/product/create-product-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { Product, ProductDomainError } from "@entities/product/product"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Create Product Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Creating Product domain entity using domain constructor
 * 2. Domain entity validates business rules (price > 0, name not empty)
 * 3. Domain raises ProductCreatedEvent automatically
 * 4. Events dispatched after successful persistence
 * 5. Use case orchestrates, domain enforces business rules
 *
 * Changes from anemic version:
 * - Domain entity now validates its own data
 * - Business logic moved from use case to domain
 * - Events dispatched after persistence
 * - UUIDService generates IDs (not database)
 */
export class CreateProductUseCase implements CreateProductInputPort {
    constructor(
        private readonly createProductOutputPort: CreateProductOutputPort,
        private readonly uuidService: UUIDService,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: CreateProductCommand) {
        try {
            // Step 1: Create Product domain entity
            // Domain entity will:
            // - Validate name (not empty, min length)
            // - Validate price (> 0)
            // - Validate category exists
            // - Raise ProductCreatedEvent
            // - Throw ProductDomainError if validation fails
            const productId = this.uuidService.generate()

            let product: Product
            try {
                product = new Product(
                    productId,
                    input.name,
                    input.description,
                    input.price,
                    String(input.categoryId), // Convert to string for domain
                    input.active ?? true,
                    true // raiseEvent = true (this is a NEW product)
                )
            } catch (error) {
                if (error instanceof ProductDomainError) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(error.message, 400),
                    }
                }
                throw error
            }

            // Step 2: Persist the product
            // Repository adapts between domain (string ID) and infrastructure (number ID)
            const created = await this.createProductOutputPort.create({
                name: product.name,
                description: product.description,
                price: product.price,
                categoryId: Number(product.categoryId), // Convert back to number for DB
                active: product.active,
            })

            // Step 3: Dispatch domain events
            // Events raised by: Product constructor (ProductCreatedEvent)
            const events = product.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[CreateProductUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 4: Clear events after dispatching
            product.clearDomainEvents()

            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            // If error is ProductDomainError, preserve the validation message
            if (error instanceof ProductDomainError) {
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
                        "Failed to create product",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createProductOutputPort.finish()
    }
}
