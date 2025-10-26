import { OrderItem } from "@entities/order-item/order-item"

/**
 * Output Port for creating an order item
 * Adapter boundary uses DB-shaped input (numeric foreign keys)
 */
export interface CreateOrderItemOutputPort {
    create(input: {
        orderId: number
        productId: number
        productName: string
        unitPrice: number
        quantity: number
    }): Promise<OrderItem>
    finish(): Promise<void>
}
