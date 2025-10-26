import { BaseEntity } from "../base-entity"
import { CustomerCreatedEvent } from "../../events/customer/customer-created-event"
import { CustomerUpdatedEvent } from "../../events/customer/customer-updated-event"

/**
 * Customer Domain Entity
 *
 * Rich domain model for customers. Encapsulates state and raises domain events
 * for significant changes.
 */
export class Customer extends BaseEntity {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _email: string,
        private _cpf: string,
        raiseEvent: boolean = false
    ) {
        super()

        if (raiseEvent) {
            this.addDomainEvent(
                new CustomerCreatedEvent(_id, _name, _email, _cpf)
            )
        }
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get email(): string {
        return this._email
    }

    get cpf(): string {
        return this._cpf
    }

    /**
     * Update contact information for the customer and raise an event.
     */
    updateContactInfo(name: string, email: string): void {
        const previousEmail = this._email

        this._name = name
        this._email = email

        this.addDomainEvent(
            new CustomerUpdatedEvent(this._id, name, email, previousEmail)
        )
    }
}
