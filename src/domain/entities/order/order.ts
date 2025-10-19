import { BaseEntity } from "@entities/base-entity"
import { OrderItem } from "@entities/order-item/order-item"

export enum OrderStatus {
    RECEIVED = "RECEIVED",
    PREPARING = "PREPARING",
    READY = "READY",
    FINISHED = "FINISHED",
}

export interface Order extends BaseEntity {
    customerId?: number
    items: OrderItem[]
    status: OrderStatus
    createdAt: Date
    statusUpdatedAt: Date
    totalAmount: number
    pickupCode?: string
}
