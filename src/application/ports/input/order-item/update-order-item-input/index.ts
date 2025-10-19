import { OrderItem } from "@entities/order-item/order-item"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdateOrderItemCommand {
    id: number
    orderId?: number
    productId?: number
    productName?: string
    unitPrice?: number
    quantity?: number
}

export interface UpdateOrderItemInputPort
    extends UseCase<UpdateOrderItemCommand, OrderItem> {}
