import { Order, OrderStatus } from "@entities/order/order"

/**
 * Output Port for creating an order
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateOrderItemPersistence {
    productId: number
    productName: string
    unitPrice: number
    quantity: number
}

export interface CreateOrderPersistenceInput {
    customerId?: number
    status: OrderStatus
    statusUpdatedAt: Date
    totalAmount: number
    pickupCode?: string
    items: CreateOrderItemPersistence[]
}

export interface CreateOrderOutputPort {
    create(input: CreateOrderPersistenceInput): Promise<Order>
    finish(): Promise<void>
}
