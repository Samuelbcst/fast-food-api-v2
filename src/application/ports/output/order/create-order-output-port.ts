import { BaseEntity } from "@entities/base-entity"
import { Order } from "@entities/order/order"

/**
 * Output Port for creating an order
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateOrderOutputPort {
    create(input: Omit<Order, keyof BaseEntity>): Promise<Order>
    finish(): Promise<void>
}
