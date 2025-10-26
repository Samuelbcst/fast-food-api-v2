import { CategoryCreatedEvent } from "@domain/events/category/category-created-event"
import { EventHandler } from "@domain/events/event-dispatcher"

/**
 * Category Created Event Handler
 *
 * This handler is called whenever a CategoryCreatedEvent is dispatched.
 * You can have multiple handlers for the same event!
 *
 * Use this pattern to implement side effects like:
 * - Sending notifications
 * - Updating caches
 * - Triggering analytics
 * - Creating audit logs
 * - Syncing with external systems
 *
 * The key benefit: The Category entity and CreateCategoryUseCase don't need
 * to know about any of this. They just raise the event and forget about it!
 */
export class CategoryCreatedHandler
    implements EventHandler<CategoryCreatedEvent>
{
    /**
     * Handle the CategoryCreated event
     *
     * @param event The CategoryCreatedEvent that was raised
     */
    async handle(event: CategoryCreatedEvent): Promise<void> {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║          🎉 CATEGORY CREATED EVENT HANDLED 🎉             ║
╠════════════════════════════════════════════════════════════╣
║  Event Type: ${event.eventType.padEnd(44)} ║
║  Category ID: ${event.aggregateId.substring(0, 43).padEnd(43)} ║
║  Name: ${event.name.substring(0, 50).padEnd(50)} ║
║  Description: ${event.description.substring(0, 45).padEnd(45)} ║
║  Occurred At: ${event.occurredOn.toISOString().substring(0, 43).padEnd(43)} ║
╚════════════════════════════════════════════════════════════╝
        `)

        // TODO: In a real application, you might do things like:
        //
        // 1. Send a notification to administrators
        // await this.notificationService.notify({
        //     type: 'CATEGORY_CREATED',
        //     message: `New category "${event.name}" was created`,
        //     recipients: ['admin@fastfood.com']
        // })
        //
        // 2. Invalidate cache
        // await this.cacheService.invalidate('categories:*')
        //
        // 3. Track analytics
        // await this.analyticsService.track({
        //     event: 'category_created',
        //     properties: {
        //         categoryId: event.aggregateId,
        //         categoryName: event.name
        //     }
        // })
        //
        // 4. Create audit log entry
        // await this.auditLogRepository.create({
        //     action: 'CATEGORY_CREATED',
        //     entityType: 'CATEGORY',
        //     entityId: event.aggregateId,
        //     timestamp: event.occurredOn
        // })
    }
}
