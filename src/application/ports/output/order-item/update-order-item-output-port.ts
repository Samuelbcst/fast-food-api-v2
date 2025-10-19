import { OrderItem } from "@entities/order-item/order-item"

/**
 * Output Port for updating an order item
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateOrderItemOutputPort {
    execute(input: {
        id: number
        orderId?: number
        productId?: number
        productName?: string
        unitPrice?: number
        quantity?: number
    }): Promise<OrderItem | null>
    finish(): Promise<void>
}
