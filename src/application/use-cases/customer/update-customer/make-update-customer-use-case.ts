import { UpdateCustomerInputPort } from "@application/ports/input/customer/update-customer-input"
import { UpdateCustomerOutputPort } from "@application/ports/output/customer/update-customer-output-port"
import { UpdateCustomerUseCase } from "."

export const makeUpdateCustomerUseCase = (
    repository: UpdateCustomerOutputPort
): UpdateCustomerInputPort => new UpdateCustomerUseCase(repository)
