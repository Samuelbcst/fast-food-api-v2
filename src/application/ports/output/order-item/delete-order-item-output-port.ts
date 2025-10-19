import { OrderItem } from "@entities/order-item/order-item"

/**
 * Output Port for deleting an order item
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeleteOrderItemOutputPort {
    execute(id: number): Promise<OrderItem | null>
    finish(): Promise<void>
}
