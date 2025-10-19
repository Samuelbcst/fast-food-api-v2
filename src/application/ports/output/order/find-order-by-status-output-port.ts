import { Order } from "@entities/order/order"
import { OrderStatus } from "@entities/order/order-status"

/**
 * Output Port for finding orders by status
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindOrderByStatusOutputPort {
    execute(status: OrderStatus): Promise<Order[]>
    finish(): Promise<void>
}
