import { BaseEntity } from "../base-entity"
import { CategoryCreatedEvent } from "../../events/category/category-created-event"
import { CategoryUpdatedEvent } from "../../events/category/category-updated-event"

/**
 * Category Domain Entity
 *
 * Represents a product category in the fast-food system.
 * Categories are used to organize products (Lanche, Acompanhamento, Bebida, Sobremesa).
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

    /**
     * Update the category
     *
     * This is a domain method that encapsulates the business logic
     * of updating a category and raises the appropriate event.
     *
     * @param name New name for the category
     * @param description New description for the category
     */
    update(name: string, description: string): void {
        const previousName = this._name

        this._name = name
        this._description = description

        // Raise an event to notify that the category was updated
        this.addDomainEvent(
            new CategoryUpdatedEvent(this._id, name, description, previousName)
        )
    }
}

