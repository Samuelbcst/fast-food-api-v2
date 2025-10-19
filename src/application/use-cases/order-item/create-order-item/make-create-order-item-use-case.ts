import { CreateOrderItemInputPort } from "@application/ports/input/order-item/create-order-item-input"
import { CreateOrderItemOutputPort } from "@application/ports/output/order-item/create-order-item-output-port"
import { CreateOrderItemUseCase } from "."

export const makeCreateOrderItemUseCase = (
    repository: CreateOrderItemOutputPort
): CreateOrderItemInputPort => new CreateOrderItemUseCase(repository)
