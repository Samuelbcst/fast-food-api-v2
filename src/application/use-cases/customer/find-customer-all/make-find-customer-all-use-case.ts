import { FindCustomerAllInputPort } from "@application/ports/input/customer/find-customer-all-input"
import { FindCustomerAllOutputPort } from "@application/ports/output/customer/find-customer-all-output-port"
import { FindCustomerAllUseCase } from "."

export const makeFindCustomerAllUseCase = (
    repository: FindCustomerAllOutputPort
): FindCustomerAllInputPort => new FindCustomerAllUseCase(repository)
