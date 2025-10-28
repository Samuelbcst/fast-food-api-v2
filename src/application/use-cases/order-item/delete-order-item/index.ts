import { DeleteOrderItemCommand, DeleteOrderItemInputPort } from "@application/ports/input/order-item/delete-order-item-input"
import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { DeleteOrderItemOutputPort } from "@application/ports/output/order-item/delete-order-item-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Delete OrderItem Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Verifying entity exists before deletion
 * 3. Domain raises OrderItemDeletedEvent
 * 4. Events dispatched after successful deletion
 *
 * Changes from anemic version:
 * - Load existing order item entity first to verify it exists
 * - Raise OrderItemDeletedEvent before deletion
 * - Use case dispatches events after persistence
 *
 * Note: In a more sophisticated domain model, we might add business rules
 * like "cannot delete order item if order is already in preparation" - this would be
 * validated by a domain method like orderItem.canBeDeleted()
 */
export class DeleteOrderItemUseCase implements DeleteOrderItemInputPort {
    constructor(
        private readonly deleteOrderItemOutputPort: DeleteOrderItemOutputPort,
        private readonly findOrderItemByIdOutputPort: FindOrderItemByIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: DeleteOrderItemCommand) {
        try {
            // Step 1: Load existing order item (domain entity)
            const currentOrderItem = await this.findOrderItemByIdOutputPort.execute(
                input.id
            )

            if (!currentOrderItem) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order item not found.", 404),
                }
            }

            // Step 2: Business rule validation (if needed)
            // In a more sophisticated model, we might check:
            // if (!currentOrderItem.canBeDeleted()) {
            //     return {
            //         success: false,
            //         result: null,
            //         error: new CustomError("Order item cannot be deleted (order in preparation)", 400)
            //     }
            // }

            // Step 3: Raise deletion event
            // Note: We raise the event BEFORE deletion since we still have the entity data
            currentOrderItem.raiseDeleteEvent()

            // Step 4: Delete from persistence
            const deleted = await this.deleteOrderItemOutputPort.execute(input.id)

            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order item not found.", 404),
                }
            }

            // Step 5: Dispatch domain events
            const events = currentOrderItem.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[DeleteOrderItemUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 6: Clear events
            currentOrderItem.clearDomainEvents()

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
                        "Failed to delete order item",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.deleteOrderItemOutputPort.finish(),
            this.findOrderItemByIdOutputPort.finish(),
        ])
    }
}
