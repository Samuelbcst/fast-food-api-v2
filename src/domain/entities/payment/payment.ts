import { BaseEntity } from "../base-entity"
import { PaymentCreatedEvent } from "../../events/payment/payment-created-event"
import { PaymentUpdatedEvent } from "../../events/payment/payment-updated-event"
import { PaymentApprovedEvent } from "../../events/payment/payment-approved-event"
import { PaymentRejectedEvent } from "../../events/payment/payment-rejected-event"

export enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

/**
 * Domain Exception for Payment-specific business rule violations
 */
export class PaymentDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "PaymentDomainError"
    }
}

/**
 * Rich Payment domain entity
 *
 * Encapsulates business rules for payment management:
 * - Payment amount must be greater than 0
 * - Payment status can only transition from PENDING to APPROVED or REJECTED
 * - Once APPROVED or REJECTED, status cannot change (immutable final states)
 * - Approved payments must have a paidAt timestamp
 * - Payment belongs to exactly one order
 */
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

        // Validate invariants on construction
        this.validateAmount(_amount)
        this.validateOrderId(_orderId)

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

    // ========================================
    // BUSINESS LOGIC - Payment Lifecycle
    // ========================================

    /**
     * Approve the payment
     * Business rule: Can only approve PENDING payments
     *
     * @throws PaymentDomainError if payment is not pending
     */
    approve(): void {
        if (this._paymentStatus !== PaymentStatus.PENDING) {
            throw new PaymentDomainError(
                `Cannot approve payment with status ${this._paymentStatus}. ` +
                `Only PENDING payments can be approved.`
            )
        }

        this._paymentStatus = PaymentStatus.APPROVED
        this._paidAt = new Date()

        this.addDomainEvent(new PaymentApprovedEvent(
            this._id,
            this._orderId,
            this._amount,
            this._paidAt
        ))
    }

    /**
     * Reject the payment
     * Business rule: Can only reject PENDING payments
     *
     * @throws PaymentDomainError if payment is not pending
     */
    reject(reason?: string): void {
        if (this._paymentStatus !== PaymentStatus.PENDING) {
            throw new PaymentDomainError(
                `Cannot reject payment with status ${this._paymentStatus}. ` +
                `Only PENDING payments can be rejected.`
            )
        }

        this._paymentStatus = PaymentStatus.REJECTED
        this._paidAt = null // Rejected payments don't have a paid timestamp

        this.addDomainEvent(new PaymentRejectedEvent(
            this._id,
            this._orderId,
            this._amount,
            reason
        ))
    }

    /**
     * Update payment status with validation
     * This is a lower-level method - prefer using approve() or reject()
     *
     * @throws PaymentDomainError if status transition is invalid
     */
    updateStatus(status: PaymentStatus, paidAt?: Date | null): void {
        // Validate status transition
        if (!this.canTransitionTo(status)) {
            throw new PaymentDomainError(
                `Cannot transition from ${this._paymentStatus} to ${status}. ` +
                `Valid transitions: ${this.getValidTransitions().join(", ")}`
            )
        }

        // Business rule: APPROVED payments must have paidAt timestamp
        if (status === PaymentStatus.APPROVED && !paidAt) {
            throw new PaymentDomainError(
                "Approved payments must have a paidAt timestamp"
            )
        }

        const previous = this._paymentStatus
        this._paymentStatus = status
        this._paidAt = paidAt

        this.addDomainEvent(new PaymentUpdatedEvent(this._id, status, previous, paidAt))
    }

    /**
     * Check if payment can transition to a new status
     * Business rule: PENDING → APPROVED or REJECTED only
     * Final states (APPROVED/REJECTED) cannot transition
     */
    private canTransitionTo(newStatus: PaymentStatus): boolean {
        const validTransitions = this.getValidTransitions()
        return validTransitions.includes(newStatus)
    }

    /**
     * Get valid status transitions for current status
     * Encapsulates the business rule for payment workflow
     */
    private getValidTransitions(): PaymentStatus[] {
        const transitions: Record<PaymentStatus, PaymentStatus[]> = {
            [PaymentStatus.PENDING]: [PaymentStatus.APPROVED, PaymentStatus.REJECTED],
            [PaymentStatus.APPROVED]: [], // Final state - no transitions
            [PaymentStatus.REJECTED]: [], // Final state - no transitions
        }
        return transitions[this._paymentStatus]
    }

    // ========================================
    // QUERY METHODS (Domain Knowledge)
    // ========================================

    /**
     * Check if payment is paid (approved)
     */
    isPaid(): boolean {
        return this._paymentStatus === PaymentStatus.APPROVED
    }

    /**
     * Check if payment is pending
     */
    isPending(): boolean {
        return this._paymentStatus === PaymentStatus.PENDING
    }

    /**
     * Check if payment is rejected
     */
    isRejected(): boolean {
        return this._paymentStatus === PaymentStatus.REJECTED
    }

    /**
     * Check if payment is in a final state (cannot be changed)
     */
    isFinal(): boolean {
        return this._paymentStatus === PaymentStatus.APPROVED ||
               this._paymentStatus === PaymentStatus.REJECTED
    }

    /**
     * Check if payment can be processed (is pending)
     */
    canBeProcessed(): boolean {
        return this._paymentStatus === PaymentStatus.PENDING
    }

    /**
     * Check if payment is successful (approved and has paidAt)
     */
    isSuccessful(): boolean {
        return this._paymentStatus === PaymentStatus.APPROVED &&
               this._paidAt !== null &&
               this._paidAt !== undefined
    }

    /**
     * Get payment age in milliseconds (time since creation would require createdAt)
     * For now, returns time since payment if approved
     */
    getTimeSincePaid(): number | null {
        if (!this._paidAt) {
            return null
        }
        return Date.now() - this._paidAt.getTime()
    }

    // ========================================
    // INVARIANT VALIDATION
    // ========================================

    /**
     * Validate payment amount business rule
     * Business rule: Amount must be greater than 0
     *
     * @throws PaymentDomainError if amount is invalid
     */
    private validateAmount(amount: number): void {
        if (amount <= 0) {
            throw new PaymentDomainError(
                `Payment amount must be greater than 0, received: ${amount}`
            )
        }

        if (amount > 999999.99) {
            throw new PaymentDomainError(
                `Payment amount cannot exceed 999999.99, received: ${amount}`
            )
        }
    }

    /**
     * Validate order ID business rule
     * Business rule: Payment must be associated with an order
     *
     * @throws PaymentDomainError if order ID is invalid
     */
    private validateOrderId(orderId: string): void {
        if (!orderId || orderId.trim().length === 0) {
            throw new PaymentDomainError("Payment must be associated with an order")
        }
    }
}
