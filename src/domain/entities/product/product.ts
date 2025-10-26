import { BaseEntity } from "../base-entity"
import { ProductCreatedEvent } from "../../events/product/product-created-event"
import { ProductUpdatedEvent } from "../../events/product/product-updated-event"

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

    update(name: string, description: string | undefined, price: number, active?: boolean): void {
        const previousName = this._name
        this._name = name
        this._description = description
        this._price = price
        if (typeof active !== "undefined") this._active = active
        this.addDomainEvent(new ProductUpdatedEvent(this._id, name, description, price, previousName))
    }
}
