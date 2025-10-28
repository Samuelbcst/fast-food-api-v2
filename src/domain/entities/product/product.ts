import { BaseEntity } from "../base-entity"
import { ProductCreatedEvent } from "../../events/product/product-created-event"
import { ProductUpdatedEvent } from "../../events/product/product-updated-event"
import { ProductActivatedEvent } from "../../events/product/product-activated-event"
import { ProductDeactivatedEvent } from "../../events/product/product-deactivated-event"
import { ProductDeletedEvent } from "../../events/product/product-deleted-event"

/**
 * Domain Exception for Product-specific business rule violations
 */
export class ProductDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ProductDomainError"
    }
}

/**
 * Rich Product domain entity
 *
 * Encapsulates business rules for product management:
 * - Product name must not be empty
 * - Price must be greater than 0
 * - Product must be active to be available for sale
 * - Products belong to a category
 */
export class Product extends BaseEntity {
    constructor(
        private readonly _id: string,
        private _name: string,
        private _description: string | undefined,
        private _price: number,
        private _categoryId: string,
        private _active: boolean | undefined = true,
        raiseEvent: boolean = false
    ) {
        super()

        // Validate invariants on construction
        this.validateName(_name)
        this.validatePrice(_price)

        if (raiseEvent) {
            this.addDomainEvent(new ProductCreatedEvent(_id, _name, _description, _price, _categoryId, _active))
        }
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get description(): string | undefined {
        return this._description
    }

    get price(): number {
        return this._price
    }

    get categoryId(): string {
        return this._categoryId
    }

    get active(): boolean | undefined {
        return this._active
    }

    // ========================================
    // BUSINESS LOGIC - Product Lifecycle
    // ========================================

    /**
     * Activate the product for sale
     * Product must have valid price to be activated
     *
     * @throws ProductDomainError if price is invalid
     */
    activate(): void {
        this.validatePrice(this._price)

        if (this._active === true) {
            // Already active, no need to raise event
            return
        }

        this._active = true
        this.addDomainEvent(new ProductActivatedEvent(
            this._id,
            this._name,
            this._price,
            this._categoryId
        ))
    }

    /**
     * Deactivate the product from sale
     * Deactivated products cannot be added to new orders
     */
    deactivate(): void {
        if (this._active === false) {
            // Already inactive, no need to raise event
            return
        }

        this._active = false
        this.addDomainEvent(new ProductDeactivatedEvent(
            this._id,
            this._name
        ))
    }

    /**
     * Update product details with validation
     *
     * @throws ProductDomainError if validation fails
     */
    update(name: string, description: string | undefined, price: number, active?: boolean): void {
        this.validateName(name)
        this.validatePrice(price)

        const previousName = this._name
        this._name = name
        this._description = description
        this._price = price

        if (typeof active !== "undefined") {
            this._active = active
        }

        this.addDomainEvent(new ProductUpdatedEvent(this._id, name, description, price, previousName))
    }

    /**
     * Change product category
     * Business rule: Product must belong to a valid category
     */
    changeCategory(newCategoryId: string): void {
        if (!newCategoryId || newCategoryId.trim().length === 0) {
            throw new ProductDomainError("Category ID cannot be empty")
        }

        this._categoryId = newCategoryId

        this.addDomainEvent(new ProductUpdatedEvent(
            this._id,
            this._name,
            this._description,
            this._price,
            this._name
        ))
    }

    /**
     * Update product price with validation
     *
     * @throws ProductDomainError if price is invalid
     */
    updatePrice(newPrice: number): void {
        this.validatePrice(newPrice)

        this._price = newPrice

        this.addDomainEvent(new ProductUpdatedEvent(
            this._id,
            this._name,
            this._description,
            this._price,
            this._name
        ))
    }

    /**
     * Update product details (partial update)
     * Only updates fields that are provided
     *
     * @throws ProductDomainError if validation fails
     */
    updateDetails(updates: {
        name?: string
        description?: string
        price?: number
        categoryId?: string
    }): void {
        const previousName = this._name

        // Validate and apply updates
        if (updates.name !== undefined) {
            this.validateName(updates.name)
            this._name = updates.name
        }

        if (updates.description !== undefined) {
            this._description = updates.description
        }

        if (updates.price !== undefined) {
            this.validatePrice(updates.price)
            this._price = updates.price
        }

        if (updates.categoryId !== undefined) {
            if (!updates.categoryId || updates.categoryId.trim().length === 0) {
                throw new ProductDomainError("Category ID cannot be empty")
            }
            this._categoryId = updates.categoryId
        }

        this.addDomainEvent(new ProductUpdatedEvent(
            this._id,
            this._name,
            this._description,
            this._price,
            previousName
        ))
    }

    /**
     * Raise deletion event
     * Called before product is deleted from persistence
     */
    raiseDeleteEvent(): void {
        this.addDomainEvent(new ProductDeletedEvent(
            this._id,
            this._name,
            this._categoryId
        ))
    }

    // ========================================
    // QUERY METHODS (Domain Knowledge)
    // ========================================

    /**
     * Check if product is available for sale
     * Business rule: Product must be active and have valid price
     */
    isAvailableForSale(): boolean {
        return this._active === true && this._price > 0
    }

    /**
     * Check if product is active
     */
    isActive(): boolean {
        return this._active === true
    }

    /**
     * Check if product is in a specific category
     */
    belongsToCategory(categoryId: string): boolean {
        return this._categoryId === categoryId
    }

    /**
     * Check if product has a description
     */
    hasDescription(): boolean {
        return this._description !== undefined && this._description.trim().length > 0
    }

    // ========================================
    // INVARIANT VALIDATION
    // ========================================

    /**
     * Validate product name business rule
     * Business rule: Product name must not be empty
     *
     * @throws ProductDomainError if name is invalid
     */
    private validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new ProductDomainError("Product name cannot be empty")
        }

        if (name.trim().length > 200) {
            throw new ProductDomainError("Product name cannot exceed 200 characters")
        }
    }

    /**
     * Validate product price business rule
     * Business rule: Price must be greater than 0
     *
     * @throws ProductDomainError if price is invalid
     */
    private validatePrice(price: number): void {
        if (price <= 0) {
            throw new ProductDomainError(
                `Product price must be greater than 0, received: ${price}`
            )
        }

        if (price > 999999.99) {
            throw new ProductDomainError(
                `Product price cannot exceed 999999.99, received: ${price}`
            )
        }
    }
}
