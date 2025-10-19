import { UpdateOrderItemInputPort } from "@application/ports/input/order-item/update-order-item-input"
import { UpdateOrderItemOutputPort } from "@application/ports/output/order-item/update-order-item-output-port"
import { UpdateOrderItemUseCase } from "."

export const makeUpdateOrderItemUseCase = (
    repository: UpdateOrderItemOutputPort
): UpdateOrderItemInputPort => new UpdateOrderItemUseCase(repository)
