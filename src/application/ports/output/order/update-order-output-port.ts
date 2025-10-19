import { Order } from "@entities/order/order"

/**
 * Output Port for updating an order
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateOrderOutputPort {
    execute(input: {
        id: number
        customerId?: number
        totalAmount?: number
        pickupCode?: string
    }): Promise<Order | null>
    finish(): Promise<void>
}
