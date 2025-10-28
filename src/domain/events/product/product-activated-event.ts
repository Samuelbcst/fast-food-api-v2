import { BaseDomainEvent } from "../domain-event"

/**
 * Product Activated Event
 *
 * Raised when a product is activated and made available for sale.
 * This event can trigger side effects like:
 * - Updating search indexes
 * - Notifying administrators
 * - Invalidating product caches
 * - Sending notifications to customers
 */
export class ProductActivatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly name: string,
        public readonly price: number,
        public readonly categoryId: string
    ) {
        super(aggregateId, "ProductActivated", 1)
    }
}
