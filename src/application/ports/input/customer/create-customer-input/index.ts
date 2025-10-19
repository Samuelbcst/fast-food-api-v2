import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"
import { BaseEntity } from "@entities/base-entity"

export interface CreateCustomerCommand extends Omit<Customer, keyof BaseEntity> {}

export interface CreateCustomerInputPort
    extends UseCase<CreateCustomerCommand, Customer> {}
