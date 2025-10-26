import { describe, expect, it, beforeEach } from "vitest"
import { Category } from "../entities/category/category"
import { CategoryCreatedEvent } from "./category/category-created-event"
import { InMemoryEventDispatcher } from "../../infrastructure/events/in-memory-event-dispatcher"
import { EventHandler } from "./event-dispatcher"

/**
 * Domain Events Demonstration Test
 *
 * This test demonstrates how domain events work in our Clean Architecture.
 * It's a learning tool to understand the flow:
 * 1. Entity raises an event
 * 2. Event dispatcher collects the event
 * 3. Event handlers react to the event
 */
describe("Domain Events - Learning Demo", () => {
    let eventDispatcher: InMemoryEventDispatcher
    let eventsHandled: string[]

    beforeEach(() => {
        eventDispatcher = new InMemoryEventDispatcher()
        eventsHandled = []
    })

    it("should raise and handle a CategoryCreatedEvent", async () => {
        // Step 1: Create a test event handler
        const testHandler: EventHandler<CategoryCreatedEvent> = {
            handle: async (event: CategoryCreatedEvent) => {
                eventsHandled.push(
                    `CategoryCreated: ${event.name} - ${event.description}`
                )
                console.log(`✅ Event handled: ${event.eventType}`)
            },
        }

        // Step 2: Register the handler with the dispatcher
        eventDispatcher.register("CategoryCreated", testHandler)

        // Step 3: Create a new category (with raiseEvent = true)
        const category = new Category(
            "test-123",
            "Bebidas",
            "Todas as bebidas",
            true // This tells the category to raise a CategoryCreatedEvent
        )

        // Step 4: Check that the event was added to the category
        const events = category.getDomainEvents()
        expect(events).toHaveLength(1)
        expect(events[0]).toBeInstanceOf(CategoryCreatedEvent)
        expect(events[0].eventType).toBe("CategoryCreated")
        expect(events[0].aggregateId).toBe("test-123")

        // Step 5: Dispatch the events
        await eventDispatcher.dispatchAll(events)

        // Step 6: Verify the handler was called
        expect(eventsHandled).toHaveLength(1)
        expect(eventsHandled[0]).toBe("CategoryCreated: Bebidas - Todas as bebidas")

        // Step 7: Clear events from the entity
        category.clearDomainEvents()
        expect(category.getDomainEvents()).toHaveLength(0)
    })

    it("should NOT raise events when reconstructing from database", () => {
        // When reconstructing from database, we pass raiseEvent = false
        const category = new Category(
            "existing-123",
            "Lanches",
            "Todos os lanches",
            false // No event should be raised
        )

        const events = category.getDomainEvents()
        expect(events).toHaveLength(0)
    })

    it("should handle multiple event handlers for the same event", async () => {
        const handlerCallCount = { count: 0 }

        // Create multiple handlers
        const handler1: EventHandler<CategoryCreatedEvent> = {
            handle: async () => {
                handlerCallCount.count++
                console.log("Handler 1 called")
            },
        }

        const handler2: EventHandler<CategoryCreatedEvent> = {
            handle: async () => {
                handlerCallCount.count++
                console.log("Handler 2 called")
            },
        }

        // Register both handlers
        eventDispatcher.register("CategoryCreated", handler1)
        eventDispatcher.register("CategoryCreated", handler2)

        // Create category and dispatch event
        const category = new Category("test-456", "Sobremesas", "Doces", true)
        await eventDispatcher.dispatchAll(category.getDomainEvents())

        // Both handlers should have been called
        expect(handlerCallCount.count).toBe(2)
    })

    it("should continue dispatching even if one handler fails", async () => {
        const successfulHandlerCalled = { called: false }

        // Handler that throws an error
        const failingHandler: EventHandler<CategoryCreatedEvent> = {
            handle: async () => {
                throw new Error("Handler failed!")
            },
        }

        // Handler that succeeds
        const successfulHandler: EventHandler<CategoryCreatedEvent> = {
            handle: async () => {
                successfulHandlerCalled.called = true
            },
        }

        // Register both handlers
        eventDispatcher.register("CategoryCreated", failingHandler)
        eventDispatcher.register("CategoryCreated", successfulHandler)

        // Create category and dispatch event
        const category = new Category("test-789", "Test", "Test", true)
        await eventDispatcher.dispatchAll(category.getDomainEvents())

        // The successful handler should still have been called
        // even though the first handler failed
        expect(successfulHandlerCalled.called).toBe(true)
    })

    it("should support update events", () => {
        // Create a category
        const category = new Category(
            "update-test",
            "Original Name",
            "Original Description",
            false // Don't raise creation event
        )

        // Update the category (this raises an UpdatedEvent)
        category.update("New Name", "New Description")

        // Check that the update event was raised
        const events = category.getDomainEvents()
        expect(events).toHaveLength(1)
        expect(events[0].eventType).toBe("CategoryUpdated")

        const updateEvent = events[0] as any
        expect(updateEvent.name).toBe("New Name")
        expect(updateEvent.previousName).toBe("Original Name")
    })
})
