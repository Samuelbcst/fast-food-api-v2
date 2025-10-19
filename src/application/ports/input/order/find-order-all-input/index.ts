import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindOrderAllInputPort
    extends UseCase<void, Order[]> {}
