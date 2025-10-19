import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindCustomerByIdCommand {
    id: number
}

export interface FindCustomerByIdInputPort
    extends UseCase<FindCustomerByIdCommand, Customer> {}
