import { DomainEvent } from "../events/domain-event"

/**
 * Base Entity Abstract Class
 *
 * All domain entities should extend this class.
 * Provides common functionality for managing domain events.
 *
 * NOTE: This used to be an interface, but we changed it to an abstract class
 * to support domain events. Each entity implementation should provide its own
 * id, createdAt, and updatedAt properties.
 */
export abstract class BaseEntity {
    /**
     * Array to store domain events raised by this entity
     * Private to ensure events are managed through the provided methods
     */
    private _domainEvents: DomainEvent[] = []

    /**
     * Add a domain event to this entity
     * Events will be dispatched later by the use case
     *
     * @param event The domain event to add
     */
    protected addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event)
        console.log(
            `[Entity] Added event: ${event.eventType} for aggregate: ${event.aggregateId}`
        )
    }

    /**
     * Get all domain events raised by this entity
     * Returns a copy to prevent external modification
     *
     * @returns Array of domain events
     */
    public getDomainEvents(): DomainEvent[] {
        return [...this._domainEvents]
    }

    /**
     * Clear all domain events from this entity
     * Should be called after events have been dispatched
     */
    public clearDomainEvents(): void {
        this._domainEvents = []
    }

    /**
     * Check if this entity has any pending domain events
     *
     * @returns True if there are pending events
     */
    public hasDomainEvents(): boolean {
        return this._domainEvents.length > 0
    }

    /**
     * Each entity must provide its own id
     */
    public abstract get id(): string | number
}
