import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindOrderByIdCommand {
    id: number
}

export interface FindOrderByIdInputPort
    extends UseCase<FindOrderByIdCommand, Order> {}
