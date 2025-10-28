import { CreateOrderCommand, CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { UnitOfWork } from "@application/ports/output/unit-of-work"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { CustomError } from "@application/use-cases/custom-error"
import { UUIDService } from "@domain/services/UUIDService"
import { EventDispatcher } from "@domain/events/event-dispatcher"

/**
 * Create Order Use Case (REFACTORED - Rich Domain Model)
 *
 * This use case demonstrates Clean Architecture with Rich Domain Models:
 * 1. Creates domain entities (Order, OrderItem) using domain constructors
 * 2. Domain entities encapsulate business logic (calculateTotal, validation)
 * 3. Domain events are raised automatically by entities
 * 4. Events are dispatched after successful persistence
 * 5. Use case orchestrates, domain entities enforce business rules
 *
 * Changes from anemic version:
 * - Domain entities now calculate their own totals
 * - Business logic moved from use case to domain
 * - Events dispatched after persistence
 * - UUIDService generates IDs (not database)
 */
export class CreateOrderUseCase implements CreateOrderInputPort {
    constructor(
        private readonly createOrderOutputPort: CreateOrderOutputPort,
        private readonly findProductByIdOutputPort: FindProductByIdOutputPort,
        private readonly unitOfWork: UnitOfWork,
        private readonly uuidService: UUIDService,
        private readonly eventDispatcher: EventDispatcher
    ) {}

    async execute(input: CreateOrderCommand) {
        if (!input.items || input.items.length === 0) {
            return {
                success: false,
                result: null,
                error: new CustomError("Order must contain at least one item", 400),
            }
        }

        try {
            // Execute all operations within a transaction
            // If any operation fails, all changes are automatically rolled back
            const result = await this.unitOfWork.execute(async () => {
                const orderItems: OrderItem[] = []

                // Step 1: Validate products and create OrderItem domain entities
                for (const item of input.items) {
                    const product = await this.findProductByIdOutputPort.execute(
                        item.productId // Repository expects number
                    )

                    if (!product) {
                        throw new CustomError(
                            `Product not found: ${item.productId}`,
                            404
                        )
                    }

                    // Create OrderItem domain entity (with validation)
                    // Domain entity validates: quantity > 0, unitPrice > 0
                    const orderItemId = this.uuidService.generate()
                    const orderItem = new OrderItem(
                        orderItemId,
                        "", // orderId will be set after order is created
                        String(product.id), // Ensure string for domain
                        product.name,
                        product.price,
                        item.quantity,
                        true // raiseEvent = true (this is a NEW order item)
                    )

                    orderItems.push(orderItem)
                }

                // Step 2: Create Order domain entity
                // Domain entity will:
                // - Validate items exist
                // - Calculate total from items automatically
                // - Raise OrderCreatedEvent
                const orderId = this.uuidService.generate()
                const order = new Order(
                    orderId,
                    input.customerId ? String(input.customerId) : undefined, // Convert to string
                    orderItems,
                    OrderStatus.RECEIVED,
                    0, // Total will be calculated by domain
                    undefined, // No pickup code yet
                    true // raiseEvent = true (this is a NEW order)
                )

                // Step 3: Domain calculates total (business logic in domain!)
                const totalAmount = order.calculateTotal()

                // Step 4: Persist the order
                // Repository adapts between domain (string ID) and infrastructure (number ID)
                const created = await this.createOrderOutputPort.create({
                    customerId: input.customerId ? Number(input.customerId) : undefined,
                    status: OrderStatus.RECEIVED,
                    statusUpdatedAt: new Date(),
                    totalAmount,
                    items: orderItems.map(item => ({
                        productId: Number(item.productId),
                        productName: item.productName,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                    })),
                })

                // Step 5: Dispatch domain events
                // Events raised by: Order constructor, OrderItem constructors
                const orderEvents = order.getDomainEvents()
                if (orderEvents.length > 0) {
                    console.log(
                        `[CreateOrderUseCase] Dispatching ${orderEvents.length} domain event(s) for order`
                    )
                    await this.eventDispatcher.dispatchAll(orderEvents)
                }

                // Also dispatch events from order items
                for (const item of orderItems) {
                    const itemEvents = item.getDomainEvents()
                    if (itemEvents.length > 0) {
                        await this.eventDispatcher.dispatchAll(itemEvents)
                    }
                }

                // Step 6: Clear events after dispatching
                order.clearDomainEvents()
                orderItems.forEach(item => item.clearDomainEvents())

                // Return DB-shaped id (number) to keep use-case output stable for callers
                return { id: Number(created.id) }
            })

            return {
                success: true,
                result,
            }
        } catch (error: unknown) {
            // If error is CustomError, preserve the status code
            if (error instanceof CustomError) {
                return {
                    success: false,
                    result: null,
                    error,
                }
            }

            return {
                success: false,
                result: null,
                error: new CustomError(
                    (error as Error | undefined)?.message ||
                        "Failed to create order",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return Promise.allSettled([
            this.createOrderOutputPort.finish(),
            this.findProductByIdOutputPort.finish(),
        ]).then(() => undefined)
    }
}
