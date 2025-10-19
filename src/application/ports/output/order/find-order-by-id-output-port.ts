import { Order } from "@entities/order/order"

/**
 * Output Port for finding an order by ID
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindOrderByIdOutputPort {
    execute(id: number): Promise<Order | null>
    finish(): Promise<void>
}
