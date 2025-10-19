import { BaseEntity } from "@entities/base-entity"

export interface Customer extends BaseEntity {
    name: string
    email: string
    cpf: string
}
