/**
 * Domain Event Interface
 *
 * Represents something significant that happened in the domain.
 * All domain events must implement this interface.
 */
export interface DomainEvent {
    /**
     * The ID of the aggregate/entity that produced this event
     */
    readonly aggregateId: string

    /**
     * The type of event (e.g., "CategoryCreated", "OrderStatusChanged")
     */
    readonly eventType: string

    /**
     * When the event occurred
     */
    readonly occurredOn: Date

    /**
     * Version of the event (useful for event evolution)
     */
    readonly eventVersion: number
}

/**
 * Base implementation of DomainEvent
 *
 * Provides common functionality for all domain events.
 * Concrete event classes should extend this.
 */
export abstract class BaseDomainEvent implements DomainEvent {
    public readonly occurredOn: Date
    public readonly eventVersion: number

    constructor(
        public readonly aggregateId: string,
        public readonly eventType: string,
        eventVersion: number = 1
    ) {
        this.occurredOn = new Date()
        this.eventVersion = eventVersion
    }
}
