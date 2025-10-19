import { CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { CreateOrderUseCase } from "."

export const makeCreateOrderUseCase = (
    repository: CreateOrderOutputPort
): CreateOrderInputPort => new CreateOrderUseCase(repository)
