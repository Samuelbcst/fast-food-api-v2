import { FindOrderByStatusInputPort } from "@application/ports/input/order/find-order-by-status-input"
import { FindOrderByStatusOutputPort } from "@application/ports/output/order/find-order-by-status-output-port"
import { FindOrderByStatusUseCase } from "."

export const makeFindOrderByStatusUseCase = (
    repository: FindOrderByStatusOutputPort
): FindOrderByStatusInputPort => new FindOrderByStatusUseCase(repository)
