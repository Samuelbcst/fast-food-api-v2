import { UpdateOrderInputPort } from "@application/ports/input/order/update-order-input"
import { UpdateOrderOutputPort } from "@application/ports/output/order/update-order-output-port"
import { UpdateOrderUseCase } from "."

export const makeUpdateOrderUseCase = (
    repository: UpdateOrderOutputPort
): UpdateOrderInputPort => new UpdateOrderUseCase(repository)
