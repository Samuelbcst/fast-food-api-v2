import { BaseEntity } from "../base-entity"
import { PaymentCreatedEvent } from "../../events/payment/payment-created-event"
import { PaymentUpdatedEvent } from "../../events/payment/payment-updated-event"

export enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export class Payment extends BaseEntity {
    constructor(
        private readonly _id: string,
        private _orderId: string,
        private _amount: number,
        private _paymentStatus: PaymentStatus,
        private _paidAt?: Date | null,
        raiseEvent: boolean = false
    ) {
        super()

        if (raiseEvent) {
            this.addDomainEvent(new PaymentCreatedEvent(_id, _orderId, _amount, _paymentStatus, _paidAt))
        }
    }

    get id(): string {
        return this._id
    }

    get orderId(): string {
        return this._orderId
    }

    get amount(): number {
        return this._amount
    }

    get paymentStatus(): PaymentStatus {
        return this._paymentStatus
    }

    get paidAt(): Date | null | undefined {
        return this._paidAt
    }

    updateStatus(status: PaymentStatus, paidAt?: Date | null): void {
        const previous = this._paymentStatus
        this._paymentStatus = status
        this._paidAt = paidAt
        this.addDomainEvent(new PaymentUpdatedEvent(this._id, status, previous, paidAt))
    }
}
