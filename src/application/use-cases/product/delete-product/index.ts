import { DeleteProductCommand, DeleteProductInputPort } from "@application/ports/input/product/delete-product-input"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { DeleteProductOutputPort } from "@application/ports/output/product/delete-product-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Delete Product Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Verifying entity exists before deletion
 * 3. Domain raises ProductDeletedEvent
 * 4. Events dispatched after successful deletion
 *
 * Changes from anemic version:
 * - Load existing product entity first to verify it exists
 * - Raise ProductDeletedEvent before deletion
 * - Use case dispatches events after persistence
 *
 * Note: In a more sophisticated domain model, we might add business rules
 * like "cannot delete product if it's in active orders" - this would be
 * validated by a domain method like product.canBeDeleted()
 */
export class DeleteProductUseCase implements DeleteProductInputPort {
    constructor(
        private readonly deleteProductOutputPort: DeleteProductOutputPort,
        private readonly findProductByIdOutputPort: FindProductByIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: DeleteProductCommand) {
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

            // Step 2: Business rule validation (if needed)
            // In a more sophisticated model, we might check:
            // if (!currentProduct.canBeDeleted()) {
            //     return {
            //         success: false,
            //         result: null,
            //         error: new CustomError("Product cannot be deleted (in use)", 400)
            //     }
            // }

            // Step 3: Raise deletion event
            // Note: We raise the event BEFORE deletion since we still have the entity data
            currentProduct.raiseDeleteEvent()

            // Step 4: Delete from persistence
            const deleted = await this.deleteProductOutputPort.execute(input.id)

            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Product not found.", 404),
                }
            }

            // Step 5: Dispatch domain events
            const events = currentProduct.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[DeleteProductUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 6: Clear events
            currentProduct.clearDomainEvents()

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
                        "Failed to delete product",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.deleteProductOutputPort.finish(),
            this.findProductByIdOutputPort.finish(),
        ])
    }
}
