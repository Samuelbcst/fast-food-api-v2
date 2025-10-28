import { BaseDomainEvent } from "../domain-event"

/**
 * OrderItem Deleted Domain Event
 *
 * Raised when an order item is deleted from an order.
 * This event allows other parts of the system to react to order item deletion,
 * such as:
 * - Recalculating order total
 * - Updating inventory projections
 * - Notifying kitchen of cancellations
 */
export class OrderItemDeletedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly orderId: string,
        public readonly productId: string,
        public readonly productName: string,
        public readonly quantity: number
    ) {
        super(aggregateId, "OrderItemDeleted", 1)
    }
}
