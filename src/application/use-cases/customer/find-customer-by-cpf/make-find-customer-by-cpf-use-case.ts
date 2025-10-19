import { FindCustomerByCpfInputPort } from "@application/ports/input/customer/find-customer-by-cpf-input"
import { FindCustomerByCpfOutputPort } from "@application/ports/output/customer/find-customer-by-cpf-output-port"
import { FindCustomerByCpfUseCase } from "."

export const makeFindCustomerByCpfUseCase = (
    repository: FindCustomerByCpfOutputPort
): FindCustomerByCpfInputPort => new FindCustomerByCpfUseCase(repository)
