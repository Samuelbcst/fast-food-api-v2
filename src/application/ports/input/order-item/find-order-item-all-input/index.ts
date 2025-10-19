import { OrderItem } from "@entities/order-item/order-item"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindOrderItemAllInputPort
    extends UseCase<void, OrderItem[]> {}
