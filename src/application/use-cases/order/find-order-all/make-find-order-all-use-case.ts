import { FindOrderAllInputPort } from "@application/ports/input/order/find-order-all-input"
import { FindOrderAllOutputPort } from "@application/ports/output/order/find-order-all-output-port"
import { FindOrderAllUseCase } from "."

export const makeFindOrderAllUseCase = (
    repository: FindOrderAllOutputPort
): FindOrderAllInputPort => new FindOrderAllUseCase(repository)
