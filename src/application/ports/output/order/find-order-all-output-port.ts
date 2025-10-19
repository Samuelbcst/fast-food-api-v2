import { Order } from "@entities/order/order"

/**
 * Output Port for finding all orders
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindOrderAllOutputPort {
    execute(): Promise<Order[]>
    finish(): Promise<void>
}
