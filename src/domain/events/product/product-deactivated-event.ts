import { BaseDomainEvent } from "../domain-event"

/**
 * Product Deactivated Event
 *
 * Raised when a product is deactivated and removed from sale.
 * This event can trigger side effects like:
 * - Removing from search indexes
 * - Notifying administrators
 * - Invalidating product caches
 * - Preventing new orders with this product
 */
export class ProductDeactivatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly name: string,
        public readonly reason?: string
    ) {
        super(aggregateId, "ProductDeactivated", 1)
    }
}
