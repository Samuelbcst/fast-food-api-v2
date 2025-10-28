import { CreateOrderItemCommand, CreateOrderItemInputPort } from "@application/ports/input/order-item/create-order-item-input"
import { CreateOrderItemOutputPort } from "@application/ports/output/order-item/create-order-item-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { OrderItem, OrderItemDomainError } from "@entities/order-item/order-item"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Create OrderItem Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates:
 * 1. Creating OrderItem domain entity using domain constructor
 * 2. Domain entity validates business rules (quantity > 0, unitPrice > 0)
 * 3. Domain raises OrderItemCreatedEvent automatically
 * 4. Events dispatched after successful persistence
 * 5. Use case orchestrates, domain enforces business rules
 *
 * Changes from anemic version:
 * - Domain entity now validates its own data (quantity, unitPrice)
 * - Business logic moved from use case to domain
 * - Events dispatched after persistence
 * - UUIDService generates IDs (not database)
 */
export class CreateOrderItemUseCase implements CreateOrderItemInputPort {
    constructor(
        private readonly createOrderItemOutputPort: CreateOrderItemOutputPort,
        private readonly uuidService: UUIDService,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: CreateOrderItemCommand) {
        try {
            // Step 1: Create OrderItem domain entity
            // Domain entity will:
            // - Validate quantity (> 0)
            // - Validate unitPrice (> 0)
            // - Raise OrderItemCreatedEvent
            // - Throw OrderItemDomainError if validation fails
            const orderItemId = this.uuidService.generate()

            let orderItem: OrderItem
            try {
                orderItem = new OrderItem(
                    orderItemId,
                    input.orderId, // Keep as string for domain
                    input.productId, // Keep as string for domain
                    input.productName,
                    input.unitPrice,
                    input.quantity,
                    true // raiseEvent = true (this is a NEW order item)
                )
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

            // Step 2: Persist the order item
            // Repository adapts between domain (string ID) and infrastructure (number ID)
            const created = await this.createOrderItemOutputPort.create({
                orderId: Number(input.orderId), // Convert to number for DB
                productId: Number(input.productId), // Convert to number for DB
                productName: orderItem.productName,
                unitPrice: orderItem.unitPrice,
                quantity: orderItem.quantity,
            })

            // Step 3: Dispatch domain events
            // Events raised by: OrderItem constructor (OrderItemCreatedEvent)
            const events = orderItem.getDomainEvents()
            if (events.length > 0) {
                console.log(
                    `[CreateOrderItemUseCase] Dispatching ${events.length} domain event(s)`
                )
                await this.eventDispatcher.dispatchAll(events)
            }

            // Step 4: Clear events after dispatching
            orderItem.clearDomainEvents()

            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            // If error is OrderItemDomainError, preserve the validation message
            if (error instanceof OrderItemDomainError) {
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
                        "Failed to create order item",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createOrderItemOutputPort.finish()
    }
}
