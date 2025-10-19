import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdateOrderStatusCommand {
    id: number
    status: string
}

export interface UpdateOrderStatusInputPort
    extends UseCase<UpdateOrderStatusCommand, Order> {}
