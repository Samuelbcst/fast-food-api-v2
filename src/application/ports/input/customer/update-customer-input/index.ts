import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdateCustomerCommand {
    id: number
    name?: string
    email?: string
    cpf?: string
}

export interface UpdateCustomerInputPort
    extends UseCase<UpdateCustomerCommand, Customer> {}
