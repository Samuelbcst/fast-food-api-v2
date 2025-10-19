import { FindOrderByCustomerInputPort } from "@application/ports/input/order/find-order-by-customer-input"
import { FindOrderByCustomerOutputPort } from "@application/ports/output/order/find-order-by-customer-output-port"
import { FindOrderByCustomerUseCase } from "."

export const makeFindOrderByCustomerUseCase = (
    repository: FindOrderByCustomerOutputPort
): FindOrderByCustomerInputPort => new FindOrderByCustomerUseCase(repository)
