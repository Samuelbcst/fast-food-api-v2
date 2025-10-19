import { CreateCustomerInputPort } from "@application/ports/input/customer/create-customer-input"
import { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"
import { CreateCustomerUseCase } from "."

export const makeCreateCustomerUseCase = (
    repository: CreateCustomerOutputPort
): CreateCustomerInputPort => new CreateCustomerUseCase(repository)
