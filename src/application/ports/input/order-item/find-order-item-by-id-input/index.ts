import { OrderItem } from "@entities/order-item/order-item"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindOrderItemByIdCommand {
    id: number
}

export interface FindOrderItemByIdInputPort
    extends UseCase<FindOrderItemByIdCommand, OrderItem> {}
