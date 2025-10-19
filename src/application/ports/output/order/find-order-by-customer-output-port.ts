import { Order } from "@entities/order/order"

/**
 * Output Port for finding orders by customer
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindOrderByCustomerOutputPort {
    execute(customerId: number): Promise<Order[]>
    finish(): Promise<void>
}
