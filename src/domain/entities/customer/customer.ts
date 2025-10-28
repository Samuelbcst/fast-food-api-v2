import { BaseEntity } from "../base-entity"
import { CustomerCreatedEvent } from "../../events/customer/customer-created-event"
import { CustomerUpdatedEvent } from "../../events/customer/customer-updated-event"
import { CustomerDeletedEvent } from "../../events/customer/customer-deleted-event"

/**
 * Domain Exception for Customer-specific business rule violations
 */
export class CustomerDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "CustomerDomainError"
    }
}

/**
 * Customer Domain Entity
 *
 * Rich domain model for customers. Encapsulates state and raises domain events
 * for significant changes.
 *
 * Business rules:
 * - Customer name must not be empty (3-200 characters)
 * - Email must be in valid format
 * - CPF must be valid (validated by CPF value object)
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

        // Validate invariants on construction
        this.validateName(_name)
        this.validateEmail(_email)
        this.validateCpf(_cpf)

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

    // ========================================
    // BUSINESS LOGIC - Customer Updates
    // ========================================

    /**
     * Update contact information for the customer and raise an event.
     * Validates name and email before updating.
     *
     * @throws CustomerDomainError if validation fails
     */
    updateContactInfo(name: string, email: string): void {
        this.validateName(name)
        this.validateEmail(email)

        const previousEmail = this._email

        this._name = name
        this._email = email

        this.addDomainEvent(
            new CustomerUpdatedEvent(this._id, name, email, previousEmail)
        )
    }

    /**
     * Update customer name
     *
     * @throws CustomerDomainError if name is invalid
     */
    updateName(name: string): void {
        this.validateName(name)

        this._name = name

        this.addDomainEvent(
            new CustomerUpdatedEvent(this._id, name, this._email, this._email)
        )
    }

    /**
     * Update customer email
     *
     * @throws CustomerDomainError if email is invalid
     */
    updateEmail(email: string): void {
        this.validateEmail(email)

        const previousEmail = this._email
        this._email = email

        this.addDomainEvent(
            new CustomerUpdatedEvent(this._id, this._name, email, previousEmail)
        )
    }

    /**
     * Raise deletion event
     * Called before customer is deleted from persistence
     */
    raiseDeleteEvent(): void {
        this.addDomainEvent(new CustomerDeletedEvent(
            this._id,
            this._name,
            this._email
        ))
    }

    // ========================================
    // QUERY METHODS (Domain Knowledge)
    // ========================================

    /**
     * Get customer's first name
     */
    getFirstName(): string {
        return this._name.split(" ")[0]
    }

    /**
     * Get customer's last name (if exists)
     */
    getLastName(): string | null {
        const parts = this._name.split(" ")
        return parts.length > 1 ? parts[parts.length - 1] : null
    }

    /**
     * Check if customer has a full name (first + last)
     */
    hasFullName(): boolean {
        return this._name.split(" ").length > 1
    }

    /**
     * Get email domain (e.g., "gmail.com" from "user@gmail.com")
     */
    getEmailDomain(): string {
        const parts = this._email.split("@")
        return parts.length === 2 ? parts[1] : ""
    }

    /**
     * Get formatted CPF for display (XXX.XXX.XXX-XX)
     * CPF is already stored in formatted form
     */
    getFormattedCpf(): string {
        return this._cpf
    }

    // ========================================
    // INVARIANT VALIDATION
    // ========================================

    /**
     * Validate customer name business rule
     * Business rule: Name must be between 3-200 characters and not empty
     *
     * @throws CustomerDomainError if name is invalid
     */
    private validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new CustomerDomainError("Customer name cannot be empty")
        }

        if (name.trim().length < 3) {
            throw new CustomerDomainError(
                "Customer name must be at least 3 characters long"
            )
        }

        if (name.trim().length > 200) {
            throw new CustomerDomainError(
                "Customer name cannot exceed 200 characters"
            )
        }
    }

    /**
     * Validate email business rule
     * Business rule: Email must be in valid format
     *
     * @throws CustomerDomainError if email is invalid
     */
    private validateEmail(email: string): void {
        if (!email || email.trim().length === 0) {
            throw new CustomerDomainError("Email cannot be empty")
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            throw new CustomerDomainError(
                `Invalid email format: ${email}`
            )
        }

        if (email.length > 255) {
            throw new CustomerDomainError(
                "Email cannot exceed 255 characters"
            )
        }
    }

    /**
     * Validate CPF business rule
     * Business rule: CPF must not be empty
     * (Full CPF validation is done by the CPF value object)
     *
     * @throws CustomerDomainError if CPF is invalid
     */
    private validateCpf(cpf: string): void {
        if (!cpf || cpf.trim().length === 0) {
            throw new CustomerDomainError("CPF cannot be empty")
        }
    }
}
