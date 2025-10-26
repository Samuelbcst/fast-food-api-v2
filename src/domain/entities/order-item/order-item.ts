import { BaseEntity } from "../base-entity"
import { OrderItemCreatedEvent } from "../../events/order-item/order-item-created-event"
import { OrderItemUpdatedEvent } from "../../events/order-item/order-item-updated-event"

/**
 * Rich OrderItem domain entity
 */
export class OrderItem extends BaseEntity {
    constructor(
        private readonly _id: string,
        private _orderId: string,
        private _productId: string,
        private _productName: string,
        private _unitPrice: number,
        private _quantity: number,
        raiseEvent: boolean = false
    ) {
        super()

        if (raiseEvent) {
            this.addDomainEvent(new OrderItemCreatedEvent(_id, _orderId, _productId, _productName, _unitPrice, _quantity))
        }
    }

    get id(): string {
        return this._id
    }

    get orderId(): string {
        return this._orderId
    }

    get productId(): string {
        return this._productId
    }

    get productName(): string {
        return this._productName
    }

    get unitPrice(): number {
        return this._unitPrice
    }

    get quantity(): number {
        return this._quantity
    }

    updateQuantity(quantity: number): void {
        const previous = this._quantity
        this._quantity = quantity
        this.addDomainEvent(new OrderItemUpdatedEvent(this._id, quantity, previous))
    }
}
