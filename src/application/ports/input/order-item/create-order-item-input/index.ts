import { OrderItem } from "@entities/order-item/order-item"
import { UseCase } from "@application/use-cases/base-use-case"
import { BaseEntity } from "@entities/base-entity"

export interface CreateOrderItemCommand extends Omit<OrderItem, keyof BaseEntity> {}

export interface CreateOrderItemInputPort
    extends UseCase<CreateOrderItemCommand, OrderItem> {}
