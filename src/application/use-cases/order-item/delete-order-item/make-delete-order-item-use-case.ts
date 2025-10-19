import { DeleteOrderItemInputPort } from "@application/ports/input/order-item/delete-order-item-input"
import { DeleteOrderItemOutputPort } from "@application/ports/output/order-item/delete-order-item-output-port"
import { DeleteOrderItemUseCase } from "./index"

export const makeDeleteOrderItemUseCase = (
    repository: DeleteOrderItemOutputPort
): DeleteOrderItemInputPort => new DeleteOrderItemUseCase(repository)
