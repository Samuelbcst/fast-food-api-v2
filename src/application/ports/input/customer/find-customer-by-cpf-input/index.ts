import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindCustomerByCpfCommand {
    cpf: string
}

export interface FindCustomerByCpfInputPort
    extends UseCase<FindCustomerByCpfCommand, Customer | null> {}
