import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindOrderByStatusCommand {
    status: string
}

export interface FindOrderByStatusInputPort
    extends UseCase<FindOrderByStatusCommand, Order[]> {}
