import { FindOrderItemAllInputPort } from "@application/ports/input/order-item/find-order-item-all-input"
import { FindOrderItemAllOutputPort } from "@application/ports/output/order-item/find-order-item-all-output-port"
import { FindOrderItemAllUseCase } from "."

export const makeFindOrderItemAllUseCase = (
    repository: FindOrderItemAllOutputPort
): FindOrderItemAllInputPort => new FindOrderItemAllUseCase(repository)
