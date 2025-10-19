import { FindOrderByIdInputPort } from "@application/ports/input/order/find-order-by-id-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { FindOrderByIdUseCase } from "."

export const makeFindOrderByIdUseCase = (
    repository: FindOrderByIdOutputPort
): FindOrderByIdInputPort => new FindOrderByIdUseCase(repository)
