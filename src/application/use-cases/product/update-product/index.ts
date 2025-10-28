import { UpdateProductCommand, UpdateProductInputPort } from "@application/ports/input/product/update-product-input"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { UpdateProductOutputPort } from "@application/ports/output/product/update-product-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { ProductDomainError } from "@entities/product/product"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Update Product Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Calling domain methods (update, activate, deactivate) instead of direct mutation
 * 3. Domain entity validates business rules
 * 4. Domain raises events automatically (ProductUpdatedEvent, ProductActivatedEvent, etc.)
 * 5. Events dispatched after successful persistence
 *
 * Changes from anemic version:
 * - Load existing product entity first
 * - Call domain methods (updateDetails, activate, deactivate)
 * - Domain raises ProductUpdatedEvent, ProductActivatedEvent, ProductDeactivatedEvent
 * - Use case dispatches events after persistence
 */
export class UpdateProductUseCase implements UpdateProductInputPort {
    constructor(
        private readonly updateProductOutputPort: UpdateProductOutputPort,
        private readonly findProductByIdOutputPort: FindProductByIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: UpdateProductCommand) {
        try {
            // Step 1: Load existing product (domain entity)
            const currentProduct = await this.findProductByIdOutputPort.execute(
                input.id
            )

            if (!currentProduct) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Product not found.", 404),
                }
            }

            // Step 2: Call domain methods (not direct mutation!)
            // Domain entity will:
            // - Validate business rules (price > 0, name not empty)
            // - Raise ProductUpdatedEvent
            // - If active status changes, raise ProductActivatedEvent or ProductDeactivatedEvent
            // - Throw ProductDomainError if validation fails
            try {
                // Update product details
                if (input.name || input.description !== undefined || input.price || input.categoryId) {
                    currentProduct.updateDetails({
                        name: input.name,
                        description: input.description,
                        price: input.price,
                        categoryId: input.categoryId ? String(input.categoryId) : undefined,
                    })
                }

                // Handle activation/deactivation
                if (input.active !== undefined && input.active !== currentProduct.active) {
                    if (input.active) {
                        currentProduct.activate()
                    } else {
                        currentProduct.deactivate()
                    }
                }
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

            // Step 3: Persist the updated product
            const updatedProduct = await this.updateProductOutputPort.execute({
                id: input.id,
                name: input.name,
                description: input.description,
                price: input.price,
                categoryId: input.categoryId,
                active: input.active,
            })

            if (!updatedProduct) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Product not found.", 404),
                }
            }

            // Step 4: Dispatch domain events
            const events = currentProduct.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[UpdateProductUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 5: Clear events
            currentProduct.clearDomainEvents()

            return {
                success: true,
                result: updatedProduct,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to update product",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.updateProductOutputPort.finish(),
            this.findProductByIdOutputPort.finish(),
        ])
    }
}
