import { OrderItem } from "@entities/order-item/order-item"

/**
 * Output Port for finding all order items
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindOrderItemAllOutputPort {
    execute(): Promise<OrderItem[]>
    finish(): Promise<void>
}
