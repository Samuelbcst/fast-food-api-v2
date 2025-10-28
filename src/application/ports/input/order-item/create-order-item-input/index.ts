import { OrderItem } from "@entities/order-item/order-item"
import { UseCase } from "@application/use-cases/base-use-case"

/**
 * Command for creating a new order item
 * Simple DTO representing the data needed to create an order item
 */
export interface CreateOrderItemCommand {
    orderId: string
    productId: string
    productName: string
    unitPrice: number
    quantity: number
}

export interface CreateOrderItemInputPort
    extends UseCase<CreateOrderItemCommand, OrderItem> {}
