import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindOrderByCustomerCommand {
    customerId: number
}

export interface FindOrderByCustomerInputPort
    extends UseCase<FindOrderByCustomerCommand, Order[]> {}
