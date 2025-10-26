import { BaseDomainEvent } from "../domain-event"

export class ProductCreatedEvent extends BaseDomainEvent {
    constructor(
        aggregateId: string,
        public readonly name: string,
        public readonly description: string | undefined,
        public readonly price: number,
        public readonly categoryId: string,
        public readonly active?: boolean
    ) {
        super(aggregateId, "ProductCreated", 1)
    }
}
