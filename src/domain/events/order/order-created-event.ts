import { BaseDomainEvent } from "../domain-event"
import { OrderItem } from "@entities/order-item/order-item"

/**
 * Order Created Event
 */
export class OrderCreatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly customerId: string | undefined,
        public readonly items: OrderItem[]
    ) {
        super(aggregateId, "OrderCreated", 1)
    }
}
