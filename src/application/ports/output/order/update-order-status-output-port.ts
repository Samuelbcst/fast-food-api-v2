import { Order } from "@entities/order/order"
import { OrderStatus } from "@entities/order/order-status"

/**
 * Output Port for updating order status
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateOrderStatusOutputPort {
    execute(input: { id: number; status: OrderStatus }): Promise<Order | null>
    finish(): Promise<void>
}
