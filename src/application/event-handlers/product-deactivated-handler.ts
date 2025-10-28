import { ProductDeactivatedEvent } from "@domain/events/product/product-deactivated-event"
import { EventHandler } from "@domain/events/event-dispatcher"

/**
 * Product Deactivated Event Handler
 *
 * This handler is called whenever a ProductDeactivatedEvent is dispatched.
 * Handles side effects when a product is deactivated from sale.
 */
export class ProductDeactivatedHandler implements EventHandler<ProductDeactivatedEvent> {
    /**
     * Handle the ProductDeactivated event
     *
     * @param event The ProductDeactivatedEvent that was raised
     */
    async handle(event: ProductDeactivatedEvent): Promise<void> {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║       ❌ PRODUCT DEACTIVATED EVENT HANDLED ❌              ║
╠════════════════════════════════════════════════════════════╣
║  Event Type: ${event.eventType.padEnd(44)} ║
║  Product ID: ${event.aggregateId.substring(0, 43).padEnd(43)} ║
║  Name: ${event.name.substring(0, 50).padEnd(50)} ║
║  Occurred At: ${event.occurredOn.toISOString().substring(0, 43).padEnd(43)} ║
╚════════════════════════════════════════════════════════════╝
        `)

        // TODO: In a real application, you might do things like:
        //
        // 1. Remove from search index
        // await this.searchService.removeProduct(event.aggregateId)
        //
        // 2. Invalidate cache
        // await this.cacheService.invalidate(\`products:\${event.aggregateId}\`)
        // await this.cacheService.invalidate('products:active:*')
        //
        // 3. Send notification to administrators
        // await this.notificationService.notify({
        //     type: 'PRODUCT_DEACTIVATED',
        //     message: \`Product "\${event.name}" has been removed from sale\`,
        //     recipients: ['admin@fastfood.com']
        // })
        //
        // 4. Check for pending orders with this product
        // await this.orderService.checkPendingOrdersWithProduct(event.aggregateId)
    }
}
