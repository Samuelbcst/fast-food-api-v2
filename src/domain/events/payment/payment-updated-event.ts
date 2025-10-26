import { BaseDomainEvent } from "../domain-event"
import { PaymentStatus } from "@entities/payment/payment"

export class PaymentUpdatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly status: PaymentStatus,
        public readonly previousStatus?: PaymentStatus,
        public readonly paidAt?: Date | null
    ) {
        super(aggregateId, "PaymentUpdated", 1)
    }
}
