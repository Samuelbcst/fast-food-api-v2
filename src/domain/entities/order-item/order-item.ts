import { BaseEntity } from "../base-entity"
import { OrderItemCreatedEvent } from "../../events/order-item/order-item-created-event"
import { OrderItemUpdatedEvent } from "../../events/order-item/order-item-updated-event"
import { OrderItemDeletedEvent } from "../../events/order-item/order-item-deleted-event"

/**
 * Domain Exception for OrderItem-specific business rule violations
 */
export class OrderItemDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "OrderItemDomainError"
    }
}

/**
 * Rich OrderItem domain entity
 *
 * Encapsulates business rules for order items:
 * - Quantity must be greater than 0
 * - Unit price must be greater than 0
 * - Line total is calculated from quantity * unit price
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

        // Validate invariants on construction
        this.validateQuantity(_quantity)
        this.validateUnitPrice(_unitPrice)

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

    // ========================================
    // BUSINESS LOGIC - Calculations
    // ========================================

    /**
     * Calculate the line total for this order item
     * Line total = unit price × quantity
     */
    calculateLineTotal(): number {
        return this._unitPrice * this._quantity
    }

    // ========================================
    // BUSINESS LOGIC - Modifications
    // ========================================

    /**
     * Update the quantity with validation
     *
     * @throws OrderItemDomainError if quantity is invalid
     */
    updateQuantity(quantity: number): void {
        this.validateQuantity(quantity)

        const previous = this._quantity
        this._quantity = quantity
        this.addDomainEvent(new OrderItemUpdatedEvent(this._id, quantity, previous))
    }

    /**
     * Raise deletion event
     * Called before order item is deleted from persistence
     */
    raiseDeleteEvent(): void {
        this.addDomainEvent(new OrderItemDeletedEvent(
            this._id,
            this._orderId,
            this._productId,
            this._productName,
            this._quantity
        ))
    }

    // ========================================
    // INVARIANT VALIDATION
    // ========================================

    /**
     * Validate quantity business rule
     * Business rule: Quantity must be greater than 0
     */
    private validateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new OrderItemDomainError(
                `Quantity must be greater than 0, received: ${quantity}`
            )
        }
    }

    /**
     * Validate unit price business rule
     * Business rule: Unit price must be greater than 0
     */
    private validateUnitPrice(unitPrice: number): void {
        if (unitPrice <= 0) {
            throw new OrderItemDomainError(
                `Unit price must be greater than 0, received: ${unitPrice}`
            )
        }
    }
}
