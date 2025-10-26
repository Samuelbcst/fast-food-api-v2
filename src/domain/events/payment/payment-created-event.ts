import { BaseDomainEvent } from "../domain-event"

export class PaymentCreatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly orderId: string,
        public readonly amount: number,
        public readonly paymentStatus: string,
        public readonly paidAt?: Date | null
    ) {
        super(aggregateId, "PaymentCreated", 1)
    }
}
