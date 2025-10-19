import { BaseEntity } from "@entities/base-entity"

export interface Product extends BaseEntity {
    name: string
    description?: string
    price: number
    categoryId: number
    active?: boolean
}
