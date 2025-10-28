import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"

/**
 * Command for creating a new customer
 * Simple DTO representing the data needed to create a customer
 */
export interface CreateCustomerCommand {
    name: string
    email: string
    cpf: string
}

export interface CreateCustomerInputPort
    extends UseCase<CreateCustomerCommand, Customer> {}
