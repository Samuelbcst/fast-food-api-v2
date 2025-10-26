import { BaseDomainEvent } from "../domain-event"

/**
 * Customer Updated Event
 *
 * Raised when an existing customer updates their information.
 */
export class CustomerUpdatedEvent extends BaseDomainEvent {
    constructor(
        /** The ID of the customer that was updated */
        aggregateId: string,

        /** The new name */
        public readonly name: string,

        /** The new email */
        public readonly email: string,

        /** The previous email (optional) */
        public readonly previousEmail?: string
    ) {
        super(aggregateId, "CustomerUpdated", 1)
    }
}
