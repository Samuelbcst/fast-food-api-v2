import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface DeleteOrderCommand {
    id: number
}

export interface DeleteOrderInputPort
    extends UseCase<DeleteOrderCommand, Order | null> {}
