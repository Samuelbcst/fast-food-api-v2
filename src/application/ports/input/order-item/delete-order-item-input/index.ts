import { OrderItem } from "@entities/order-item/order-item"
import { UseCase } from "@application/use-cases/base-use-case"

export interface DeleteOrderItemCommand {
    id: number
}

export interface DeleteOrderItemInputPort
    extends UseCase<DeleteOrderItemCommand, OrderItem | null> {}
