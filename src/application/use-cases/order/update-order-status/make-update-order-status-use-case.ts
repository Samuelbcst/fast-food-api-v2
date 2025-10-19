import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port/index"
import { UpdateOrderStatusUseCase } from "."

export const makeUpdateOrderStatusUseCase = (
    repository: UpdateOrderStatusOutputPort
): UpdateOrderStatusInputPort => new UpdateOrderStatusUseCase(repository)
