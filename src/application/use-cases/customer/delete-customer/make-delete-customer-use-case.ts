import { DeleteCustomerInputPort } from "@application/ports/input/customer/delete-customer-input"
import { DeleteCustomerOutputPort } from "@application/ports/output/customer/delete-customer-output-port"
import { DeleteCustomerUseCase } from "."

export const makeDeleteCustomerUseCase = (
    repository: DeleteCustomerOutputPort
): DeleteCustomerInputPort => new DeleteCustomerUseCase(repository)
