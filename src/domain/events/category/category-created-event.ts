import { BaseDomainEvent } from "../domain-event"

/**
 * Category Created Event
 *
 * Raised when a new category is created in the system.
 * Other parts of the system can listen to this event to perform side effects.
 *
 * Examples of what might listen to this:
 * - Analytics service (to track category creation)
 * - Cache invalidation (to refresh category lists)
 * - Notification service (to alert admins of new categories)
 * - Audit log (to record who created what and when)
 */
export class CategoryCreatedEvent extends BaseDomainEvent {
    constructor(
        /**
         * The ID of the category that was created
         */
        aggregateId: string,

        /**
         * The name of the created category
         */
        public readonly name: string,

        /**
         * The description of the created category
         */
        public readonly description: string
    ) {
        super(aggregateId, "CategoryCreated", 1)
    }
}
