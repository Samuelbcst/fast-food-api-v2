import { BaseDomainEvent } from "../domain-event"

/**
 * Category Updated Event
 *
 * Raised when an existing category is modified.
 */
export class CategoryUpdatedEvent extends BaseDomainEvent {
    constructor(
        /**
         * The ID of the category that was updated
         */
        aggregateId: string,

        /**
         * The new name of the category
         */
        public readonly name: string,

        /**
         * The new description of the category
         */
        public readonly description: string,

        /**
         * The previous name (optional, useful for audit trails)
         */
        public readonly previousName?: string
    ) {
        super(aggregateId, "CategoryUpdated", 1)
    }
}
