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
 * Domain Exception for Order-specific business rule violations
 */
export class OrderDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "OrderDomainError"
    }
}

/**
 * Rich Order domain entity
 *
 * Encapsulates business rules for order management:
 * - Order must have at least one item
 * - Status transitions follow a strict workflow
 * - Total is calculated from items
 * - Orders can only be modified in certain states
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
        return [...this._items] // Return copy to prevent external modification
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

    // ========================================
    // BUSINESS LOGIC - Calculations
    // ========================================

    /**
     * Calculate the total amount from all order items
     * This is the single source of truth for order total calculation
     */
    calculateTotal(): number {
        return this._items.reduce((sum, item) => {
            return sum + item.calculateLineTotal()
        }, 0)
    }

    /**
     * Recalculate and update the total amount
     * Should be called whenever items are added/removed/updated
     */
    recalculateTotal(): void {
        const newTotal = this.calculateTotal()
        this._totalAmount = newTotal
        // Event is raised by the calling method (addItem, removeItem, etc.)
    }

    // ========================================
    // BUSINESS LOGIC - Status Transitions
    // ========================================

    /**
     * Update order status with business rule validation
     *
     * Status flow: RECEIVED → PREPARING → READY → FINISHED
     *
     * @throws OrderDomainError if transition is invalid
     */
    updateStatus(newStatus: OrderStatus): void {
        // Invariant: Validate status transition
        if (!this.canTransitionTo(newStatus)) {
            throw new OrderDomainError(
                `Cannot transition from ${this._status} to ${newStatus}. ` +
                `Valid transitions: ${this.getValidTransitions().join(", ")}`
            )
        }

        // Invariant: Order must have items to be marked as READY
        if (newStatus === OrderStatus.READY && this.isEmpty()) {
            throw new OrderDomainError("Cannot mark order as READY without items")
        }

        // Invariant: Order must have total > 0 to be marked as READY
        if (newStatus === OrderStatus.READY && this._totalAmount <= 0) {
            throw new OrderDomainError("Cannot mark order as READY with total amount <= 0")
        }

        const previousStatus = this._status
        this._status = newStatus
        this.addDomainEvent(new OrderUpdatedEvent(this._id, newStatus, previousStatus))
    }

    /**
     * Check if order can transition to a new status
     * Implements the business rule for valid status transitions
     */
    private canTransitionTo(newStatus: OrderStatus): boolean {
        const validTransitions = this.getValidTransitions()
        return validTransitions.includes(newStatus)
    }

    /**
     * Get valid status transitions for current status
     * This encapsulates the business rule for the order workflow
     */
    private getValidTransitions(): OrderStatus[] {
        const transitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.RECEIVED]: [OrderStatus.PREPARING],
            [OrderStatus.PREPARING]: [OrderStatus.READY],
            [OrderStatus.READY]: [OrderStatus.FINISHED],
            [OrderStatus.FINISHED]: [], // No transitions from finished state
        }
        return transitions[this._status]
    }

    /**
     * Set pickup code when order is ready for customer pickup
     */
    setPickupCode(code: string): void {
        if (this._status !== OrderStatus.READY) {
            throw new OrderDomainError("Pickup code can only be set when order is READY")
        }
        this._pickupCode = code
        this.addDomainEvent(new OrderUpdatedEvent(this._id, this._status))
    }

    // ========================================
    // BUSINESS LOGIC - Item Management
    // ========================================

    /**
     * Add an item to the order
     * Order must be in an editable state
     *
     * @throws OrderDomainError if order is not editable
     */
    addItem(item: OrderItem): void {
        if (!this.isEditable()) {
            throw new OrderDomainError(
                `Cannot add items to order in ${this._status} status. ` +
                `Order can only be modified in RECEIVED or PREPARING status.`
            )
        }

        this._items.push(item)
        this.recalculateTotal()
        this.addDomainEvent(new OrderUpdatedEvent(this._id, this._status))
    }

    /**
     * Remove an item from the order
     *
     * @throws OrderDomainError if order is not editable or item not found
     */
    removeItem(itemId: string): void {
        if (!this.isEditable()) {
            throw new OrderDomainError(
                `Cannot remove items from order in ${this._status} status`
            )
        }

        const index = this._items.findIndex(item => item.id === itemId)
        if (index === -1) {
            throw new OrderDomainError(`Item with id ${itemId} not found in order`)
        }

        this._items.splice(index, 1)
        this.recalculateTotal()
        this.addDomainEvent(new OrderUpdatedEvent(this._id, this._status))
    }

    /**
     * Update items and recalculate total
     * This is a convenience method for bulk updates
     */
    updateItems(items: OrderItem[]): void {
        if (!this.isEditable()) {
            throw new OrderDomainError(
                `Cannot update items in order with ${this._status} status`
            )
        }

        this._items = items
        this.recalculateTotal()
        this.addDomainEvent(new OrderUpdatedEvent(this._id, this._status))
    }

    // ========================================
    // QUERY METHODS (Domain Knowledge)
    // ========================================

    /**
     * Check if order has no items
     */
    isEmpty(): boolean {
        return this._items.length === 0
    }

    /**
     * Check if order can be modified (add/remove items)
     * Business rule: Orders can only be modified in RECEIVED or PREPARING status
     */
    isEditable(): boolean {
        return this._status === OrderStatus.RECEIVED ||
               this._status === OrderStatus.PREPARING
    }

    /**
     * Check if order is completed
     */
    isCompleted(): boolean {
        return this._status === OrderStatus.FINISHED
    }

    /**
     * Check if order can be marked as ready
     * Business rule: Must have items and not be empty
     */
    canBeReady(): boolean {
        return !this.isEmpty() &&
               this._totalAmount > 0 &&
               this._status === OrderStatus.PREPARING
    }

    /**
     * Check if order is awaiting payment confirmation
     */
    isPending(): boolean {
        return this._status === OrderStatus.RECEIVED
    }
}
