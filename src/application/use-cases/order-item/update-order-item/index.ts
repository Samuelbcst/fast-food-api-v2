import { UpdateOrderItemCommand, UpdateOrderItemInputPort } from "@application/ports/input/order-item/update-order-item-input"
import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { UpdateOrderItemOutputPort } from "@application/ports/output/order-item/update-order-item-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { OrderItemDomainError } from "@entities/order-item/order-item"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Update OrderItem Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Loading domain entity from repository
 * 2. Calling domain method (updateQuantity) instead of direct mutation
 * 3. Domain entity validates business rules
 * 4. Domain raises events automatically (OrderItemUpdatedEvent)
 * 5. Events dispatched after successful persistence
 *
 * Changes from anemic version:
 * - Load existing order item entity first
 * - Call domain method (updateQuantity)
 * - Domain raises OrderItemUpdatedEvent
 * - Use case dispatches events after persistence
 */
export class UpdateOrderItemUseCase implements UpdateOrderItemInputPort {
    constructor(
        private readonly updateOrderItemOutputPort: UpdateOrderItemOutputPort,
        private readonly findOrderItemByIdOutputPort: FindOrderItemByIdOutputPort,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: UpdateOrderItemCommand) {
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

            // Step 2: Call domain method (not direct mutation!)
            // Domain entity will:
            // - Validate business rules (quantity > 0)
            // - Raise OrderItemUpdatedEvent
            // - Throw OrderItemDomainError if validation fails
            try {
                if (input.quantity !== undefined) {
                    currentOrderItem.updateQuantity(input.quantity)
                }
            } catch (error) {
                if (error instanceof OrderItemDomainError) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(error.message, 400),
                    }
                }
                throw error
            }

            // Step 3: Persist the updated order item
            const updatedOrderItem = await this.updateOrderItemOutputPort.execute({
                id: input.id,
                quantity: input.quantity,
            })

            if (!updatedOrderItem) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order item not found.", 404),
                }
            }

            // Step 4: Dispatch domain events
            const events = currentOrderItem.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[UpdateOrderItemUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 5: Clear events
            currentOrderItem.clearDomainEvents()

            return {
                success: true,
                result: updatedOrderItem,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to update order item",
                    400
                ),
            }
        }
    }

    async onFinish(): Promise<void> {
        await Promise.allSettled([
            this.updateOrderItemOutputPort.finish(),
            this.findOrderItemByIdOutputPort.finish(),
        ])
    }
}
