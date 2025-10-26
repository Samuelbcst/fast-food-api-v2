import { BaseDomainEvent } from "../domain-event"

export class OrderItemUpdatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly quantity: number,
        public readonly previousQuantity?: number
    ) {
        super(aggregateId, "OrderItemUpdated", 1)
    }
}
