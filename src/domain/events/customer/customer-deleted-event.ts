import { BaseDomainEvent } from "../domain-event"

/**
 * Customer Deleted Domain Event
 *
 * Raised when a customer is deleted from the system.
 * This event allows other parts of the system to react to customer deletion,
 * such as:
 * - Removing customer from mailing lists
 * - Archiving customer data for compliance
 * - Notifying administrators
 * - Cleaning up related data
 */
export class CustomerDeletedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly name: string,
        public readonly email: string
    ) {
        super(aggregateId, "CustomerDeleted", 1)
    }
}
