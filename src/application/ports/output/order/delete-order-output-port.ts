import { Order } from "@entities/order/order"

/**
 * Output Port for deleting an order
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeleteOrderOutputPort {
    execute(id: number): Promise<Order | null>
    finish(): Promise<void>
}
