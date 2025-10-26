import { BaseDomainEvent } from "../domain-event"

export class OrderItemCreatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly orderId: string,
        public readonly productId: string,
        public readonly productName: string,
        public readonly unitPrice: number,
        public readonly quantity: number
    ) {
        super(aggregateId, "OrderItemCreated", 1)
    }
}
