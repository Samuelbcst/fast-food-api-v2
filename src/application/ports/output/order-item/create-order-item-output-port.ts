import { BaseEntity } from "@entities/base-entity"
import { OrderItem } from "@entities/order-item/order-item"

/**
 * Output Port for creating an order item
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateOrderItemOutputPort {
    create(input: Omit<OrderItem, keyof BaseEntity>): Promise<OrderItem>
    finish(): Promise<void>
}
