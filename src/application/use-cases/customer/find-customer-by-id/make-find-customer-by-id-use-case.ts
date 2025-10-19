import { FindCustomerByIdInputPort } from "@application/ports/input/customer/find-customer-by-id-input"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { FindCustomerByIdUseCase } from "."

export const makeFindCustomerByIdUseCase = (
    repository: FindCustomerByIdOutputPort
): FindCustomerByIdInputPort => new FindCustomerByIdUseCase(repository)
