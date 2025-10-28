import { PaymentRejectedEvent } from "@domain/events/payment/payment-rejected-event"
import { EventHandler } from "@domain/events/event-dispatcher"

/**
 * Payment Rejected Event Handler
 *
 * This handler is called whenever a PaymentRejectedEvent is dispatched.
 * Handles the failure scenario when payment is not approved.
 */
export class PaymentRejectedHandler implements EventHandler<PaymentRejectedEvent> {
    /**
     * Handle the PaymentRejected event
     *
     * @param event The PaymentRejectedEvent that was raised
     */
    async handle(event: PaymentRejectedEvent): Promise<void> {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║         ⛔ PAYMENT REJECTED EVENT HANDLED ⛔              ║
╠════════════════════════════════════════════════════════════╣
║  Event Type: ${event.eventType.padEnd(44)} ║
║  Payment ID: ${event.aggregateId.substring(0, 43).padEnd(43)} ║
║  Order ID: ${event.orderId.substring(0, 45).padEnd(45)} ║
║  Amount: $${event.amount.toFixed(2).padEnd(47)} ║
║  Reason: ${(event.reason || 'Not specified').substring(0, 48).padEnd(48)} ║
║  Occurred At: ${event.occurredOn.toISOString().substring(0, 43).padEnd(43)} ║
╚════════════════════════════════════════════════════════════╝
        `)

        // TODO: In a real application, you might do things like:
        //
        // 1. Cancel the order
        // await this.orderService.cancelOrder(event.orderId, 'Payment rejected')
        //
        // 2. Send notification to customer about payment failure
        // await this.emailService.sendPaymentRejection({
        //     orderId: event.orderId,
        //     amount: event.amount,
        //     reason: event.reason
        // })
        //
        // 3. Create audit trail
        // await this.auditLogRepository.create({
        //     action: 'PAYMENT_REJECTED',
        //     entityType: 'PAYMENT',
        //     entityId: event.aggregateId,
        //     orderId: event.orderId,
        //     reason: event.reason,
        //     timestamp: event.occurredOn
        // })
        //
        // 4. Send alert to administrators if this is a pattern
        // await this.alertService.checkForPaymentPatterns(event.aggregateId)
        //
        // 5. Track analytics
        // await this.analyticsService.track({
        //     event: 'payment_rejected',
        //     properties: {
        //         paymentId: event.aggregateId,
        //         orderId: event.orderId,
        //         amount: event.amount,
        //         reason: event.reason
        //     }
        // })
    }
}
