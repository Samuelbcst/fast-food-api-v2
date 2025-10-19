import { BaseEntity } from "@entities/base-entity"

export interface Category extends BaseEntity {
    name: string
    description?: string
}
