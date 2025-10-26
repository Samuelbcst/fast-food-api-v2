import { BaseDomainEvent } from "../domain-event"

/**
 * Customer Created Event
 *
 * Raised when a new customer is created in the system.
 */
export class CustomerCreatedEvent extends BaseDomainEvent {
    constructor(
        /** The ID of the customer that was created */
        aggregateId: string,

        /** The customer's name */
        public readonly name: string,

        /** The customer's email */
        public readonly email: string,

        /** The customer's CPF */
        public readonly cpf: string
    ) {
        super(aggregateId, "CustomerCreated", 1)
    }
}
