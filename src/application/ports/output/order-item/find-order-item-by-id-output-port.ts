import { OrderItem } from "@entities/order-item/order-item"

/**
 * Output Port for finding an order item by ID
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindOrderItemByIdOutputPort {
    execute(id: number): Promise<OrderItem | null>
    finish(): Promise<void>
}
