import { DeleteOrderInputPort } from "@application/ports/input/order/delete-order-input"
import { DeleteOrderOutputPort } from "@application/ports/output/order/delete-order-output-port"
import { DeleteOrderUseCase } from "."

export const makeDeleteOrderUseCase = (
    repository: DeleteOrderOutputPort
): DeleteOrderInputPort => new DeleteOrderUseCase(repository)
