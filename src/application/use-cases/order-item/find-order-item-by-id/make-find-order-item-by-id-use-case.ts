import { FindOrderItemByIdInputPort } from "@application/ports/input/order-item/find-order-item-by-id-input"
import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { FindOrderItemByIdUseCase } from "."

export const makeFindOrderItemByIdUseCase = (
    repository: FindOrderItemByIdOutputPort
): FindOrderItemByIdInputPort => new FindOrderItemByIdUseCase(repository)
