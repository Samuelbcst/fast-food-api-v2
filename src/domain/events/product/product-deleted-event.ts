import { BaseDomainEvent } from "../domain-event"

/**
 * Product Deleted Domain Event
 *
 * Raised when a product is deleted from the system.
 * This event allows other parts of the system to react to product deletion,
 * such as:
 * - Removing product from caches
 * - Archiving product data
 * - Notifying administrators
 * - Updating search indexes
 */
export class ProductDeletedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly name: string,
        public readonly categoryId: string
    ) {
        super(aggregateId, "ProductDeleted", 1)
    }
}
