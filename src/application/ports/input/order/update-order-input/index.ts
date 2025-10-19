import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdateOrderCommand {
    id: number
    customerId?: number
    status?: string
    totalAmount?: number
    statusUpdatedAt?: Date
    pickupCode?: string
}

export interface UpdateOrderInputPort
    extends UseCase<UpdateOrderCommand, Order> {}
