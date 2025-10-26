import { BaseEntity } from "../base-entity"
import { OrderItem } from "../order-item/order-item"
import { OrderCreatedEvent } from "../../events/order/order-created-event"
import { OrderUpdatedEvent } from "../../events/order/order-updated-event"

export enum OrderStatus {
    RECEIVED = "RECEIVED",
    PREPARING = "PREPARING",
    READY = "READY",
    FINISHED = "FINISHED",
}

/**
 * Rich Order domain entity
 */
export class Order extends BaseEntity {
    constructor(
        private readonly _id: string,
        private _customerId: string | undefined,
        private _items: OrderItem[],
        private _status: OrderStatus,
        private _totalAmount: number,
        private _pickupCode?: string,
        raiseEvent: boolean = false
    ) {
        super()

        if (raiseEvent) {
            this.addDomainEvent(new OrderCreatedEvent(_id, _customerId, _items))
        }
    }

    get id(): string {
        return this._id
    }

    get customerId(): string | undefined {
        return this._customerId
    }

    get items(): OrderItem[] {
        return this._items
    }

    get status(): OrderStatus {
        return this._status
    }

    get totalAmount(): number {
        return this._totalAmount
    }

    get pickupCode(): string | undefined {
        return this._pickupCode
    }

    /** Update order status and raise an event */
    updateStatus(newStatus: OrderStatus): void {
        const previousStatus = this._status
        this._status = newStatus
        this.addDomainEvent(new OrderUpdatedEvent(this._id, newStatus, previousStatus))
    }

    /** Update items and total amount (recalculate externally before calling) */
    updateItems(items: OrderItem[], totalAmount: number): void {
        this._items = items
        this._totalAmount = totalAmount
        this.addDomainEvent(new OrderUpdatedEvent(this._id, this._status))
    }
}
