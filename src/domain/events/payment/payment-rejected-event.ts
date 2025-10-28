import { BaseDomainEvent } from "../domain-event"

/**
 * Payment Rejected Event
 *
 * Raised when a payment is rejected by the payment provider.
 * This event indicates the order cannot proceed.
 *
 * Side effects may include:
 * - Notifying customer of payment failure
 * - Canceling the order
 * - Creating audit trail
 * - Triggering retry mechanism (if applicable)
 * - Sending alerts to administrators
 */
export class PaymentRejectedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly orderId: string,
        public readonly amount: number,
        public readonly reason?: string
    ) {
        super(aggregateId, "PaymentRejected", 1)
    }
}
