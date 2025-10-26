import { BaseDomainEvent } from "../domain-event"

export class ProductUpdatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly name: string,
        public readonly description: string | undefined,
        public readonly price: number,
        public readonly previousName?: string
    ) {
        super(aggregateId, "ProductUpdated", 1)
    }
}
