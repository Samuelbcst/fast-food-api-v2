import { BaseDomainEvent } from "../domain-event"
import { OrderStatus } from "@entities/order/order"

/**
 * Order Updated Event
 */
export class OrderUpdatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly status: OrderStatus,
        public readonly previousStatus?: OrderStatus
    ) {
        super(aggregateId, "OrderUpdated", 1)
    }
}
