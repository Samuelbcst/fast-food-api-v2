import { DomainEvent } from "./domain-event"

/**
 * Event Handler Interface
 *
 * Represents a component that can handle a specific type of domain event.
 * Implement this interface to create event handlers.
 */
export interface EventHandler<T extends DomainEvent> {
    /**
     * Handle the domain event
     * @param event The domain event to handle
     */
    handle(event: T): Promise<void>
}

/**
 * Event Dispatcher Interface
 *
 * Responsible for registering event handlers and dispatching events to them.
 * This is the "message bus" for domain events.
 */
export interface EventDispatcher {
    /**
     * Register a handler for a specific event type
     * @param eventType The type of event to listen for (e.g., "CategoryCreated")
     * @param handler The handler that will process the event
     */
    register<T extends DomainEvent>(
        eventType: string,
        handler: EventHandler<T>
    ): void

    /**
     * Dispatch a single event to all registered handlers
     * @param event The event to dispatch
     */
    dispatch(event: DomainEvent): Promise<void>

    /**
     * Dispatch multiple events to all registered handlers
     * @param events Array of events to dispatch
     */
    dispatchAll(events: DomainEvent[]): Promise<void>
}
