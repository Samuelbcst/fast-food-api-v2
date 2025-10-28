import { BaseDomainEvent } from "../domain-event"

/**
 * Payment Approved Event
 *
 * Raised when a payment is approved by the payment provider.
 * This is a critical event that triggers order processing.
 *
 * Side effects may include:
 * - Updating order status to RECEIVED
 * - Sending confirmation email to customer
 * - Notifying kitchen to start preparing
 * - Creating audit trail
 * - Triggering analytics events
 */
export class PaymentApprovedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly orderId: string,
        public readonly amount: number,
        public readonly paidAt: Date
    ) {
        super(aggregateId, "PaymentApproved", 1)
    }
}
