import { Order } from "@entities/order/order"
import { UseCase } from "@application/use-cases/base-use-case"
import { BaseEntity } from "@entities/base-entity"

export interface CreateOrderCommand extends Omit<Order, keyof BaseEntity> {}

export interface CreateOrderInputPort
    extends UseCase<CreateOrderCommand, Order> {}
