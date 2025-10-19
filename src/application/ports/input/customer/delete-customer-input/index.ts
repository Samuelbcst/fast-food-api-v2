import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"

export interface DeleteCustomerCommand {
    id: number
}

export interface DeleteCustomerInputPort
    extends UseCase<DeleteCustomerCommand, Customer | null> {}
