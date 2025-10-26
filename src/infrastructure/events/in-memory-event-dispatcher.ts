import { DomainEvent } from "@domain/events/domain-event"
import {
    EventDispatcher,
    EventHandler,
} from "@domain/events/event-dispatcher"

/**
 * In-Memory Event Dispatcher
 *
 * Simple implementation of EventDispatcher that keeps handlers in memory.
 * For production systems, you might want to use a message queue (RabbitMQ, Kafka, etc.)
 * but this is perfect for learning and most applications.
 */
export class InMemoryEventDispatcher implements EventDispatcher {
    /**
     * Map of event types to their handlers
     * Example: { "CategoryCreated": [handler1, handler2], "OrderCreated": [handler3] }
     */
    private handlers: Map<string, EventHandler<any>[]> = new Map()

    /**
     * Register a handler for a specific event type
     */
    register<T extends DomainEvent>(
        eventType: string,
        handler: EventHandler<T>
    ): void {
        // If this is the first handler for this event type, create an empty array
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, [])
        }

        // Add the handler to the array
        this.handlers.get(eventType)!.push(handler)

        console.log(`[EventDispatcher] Registered handler for event: ${eventType}`)
    }

    /**
     * Dispatch a single event to all registered handlers
     */
    async dispatch(event: DomainEvent): Promise<void> {
        // Get all handlers for this event type
        const handlers = this.handlers.get(event.eventType) || []

        console.log(
            `[EventDispatcher] Dispatching event: ${event.eventType} (${handlers.length} handlers)`
        )

        // Execute all handlers
        // Note: We iterate sequentially and catch errors to prevent one handler from breaking others
        for (const handler of handlers) {
            try {
                await handler.handle(event)
            } catch (error) {
                console.error(
                    `[EventDispatcher] Error handling event ${event.eventType}:`,
                    error
                )
                // In production, you might want to:
                // - Log this to a monitoring service (e.g., Sentry, DataDog)
                // - Implement retry logic
                // - Store failed events in a dead letter queue
            }
        }
    }

    /**
     * Dispatch multiple events to all registered handlers
     */
    async dispatchAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.dispatch(event)
        }
    }

    /**
     * Utility method to clear all handlers (useful for testing)
     */
    clearHandlers(): void {
        this.handlers.clear()
    }

    /**
     * Utility method to get the number of registered handlers for an event type
     * (useful for testing and debugging)
     */
    getHandlerCount(eventType: string): number {
        return this.handlers.get(eventType)?.length || 0
    }
}
