import { BaseEntity } from "../base-entity"
import { CategoryCreatedEvent } from "../../events/category/category-created-event"
import { CategoryUpdatedEvent } from "../../events/category/category-updated-event"

/**
 * Domain Exception for Category-specific business rule violations
 */
export class CategoryDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "CategoryDomainError"
    }
}

/**
 * Category Domain Entity
 *
 * Represents a product category in the fast-food system.
 * Categories are used to organize products (Lanche, Acompanhamento, Bebida, Sobremesa).
 *
 * Business rules:
 * - Category name must not be empty (2-100 characters)
 * - Description is optional but must not exceed 500 characters
 * - Categories organize products into logical groups
 */
export class Category extends BaseEntity {
    /**
     * Create a new Category
     *
     * @param _id Unique identifier for the category
     * @param _name Name of the category
     * @param _description Optional description
     * @param raiseEvent Whether to raise a CategoryCreatedEvent (default: false for reconstruction from DB)
     */
    constructor(
        private readonly _id: string,
        private _name: string,
        private _description: string,
        raiseEvent: boolean = false
    ) {
        super()

        // Validate invariants on construction
        this.validateName(_name)
        this.validateDescription(_description)

        // If raiseEvent is true, this is a NEW category being created
        // If false, we're reconstructing an existing category from the database
        if (raiseEvent) {
            this.addDomainEvent(
                new CategoryCreatedEvent(_id, _name, _description)
            )
        }
    }

    /**
     * Get the category ID
     */
    get id(): string {
        return this._id
    }

    /**
     * Get the category name
     */
    get name(): string {
        return this._name
    }

    /**
     * Get the category description
     */
    get description(): string {
        return this._description
    }

    // ========================================
    // BUSINESS LOGIC - Category Updates
    // ========================================

    /**
     * Update the category
     *
     * This is a domain method that encapsulates the business logic
     * of updating a category and raises the appropriate event.
     *
     * @param name New name for the category
     * @param description New description for the category
     * @throws CategoryDomainError if validation fails
     */
    update(name: string, description: string): void {
        this.validateName(name)
        this.validateDescription(description)

        const previousName = this._name

        this._name = name
        this._description = description

        // Raise an event to notify that the category was updated
        this.addDomainEvent(
            new CategoryUpdatedEvent(this._id, name, description, previousName)
        )
    }

    /**
     * Update category name only
     *
     * @throws CategoryDomainError if name is invalid
     */
    updateName(name: string): void {
        this.validateName(name)

        const previousName = this._name
        this._name = name

        this.addDomainEvent(
            new CategoryUpdatedEvent(this._id, name, this._description, previousName)
        )
    }

    /**
     * Update category description only
     *
     * @throws CategoryDomainError if description is invalid
     */
    updateDescription(description: string): void {
        this.validateDescription(description)

        this._description = description

        this.addDomainEvent(
            new CategoryUpdatedEvent(this._id, this._name, description, this._name)
        )
    }

    // ========================================
    // QUERY METHODS (Domain Knowledge)
    // ========================================

    /**
     * Check if category has a description
     */
    hasDescription(): boolean {
        return this._description !== undefined &&
               this._description !== null &&
               this._description.trim().length > 0
    }

    /**
     * Get category display name (name in title case)
     */
    getDisplayName(): string {
        return this._name
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    /**
     * Check if category name matches (case-insensitive)
     */
    nameMatches(name: string): boolean {
        return this._name.toLowerCase() === name.toLowerCase()
    }

    // ========================================
    // INVARIANT VALIDATION
    // ========================================

    /**
     * Validate category name business rule
     * Business rule: Name must be between 2-100 characters and not empty
     *
     * @throws CategoryDomainError if name is invalid
     */
    private validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new CategoryDomainError("Category name cannot be empty")
        }

        if (name.trim().length < 2) {
            throw new CategoryDomainError(
                "Category name must be at least 2 characters long"
            )
        }

        if (name.trim().length > 100) {
            throw new CategoryDomainError(
                "Category name cannot exceed 100 characters"
            )
        }
    }

    /**
     * Validate category description business rule
     * Business rule: Description is optional but cannot exceed 500 characters
     *
     * @throws CategoryDomainError if description is invalid
     */
    private validateDescription(description: string): void {
        // Description is optional, so empty/null/undefined is valid
        if (!description) {
            return
        }

        if (description.trim().length > 500) {
            throw new CategoryDomainError(
                "Category description cannot exceed 500 characters"
            )
        }
    }
}

