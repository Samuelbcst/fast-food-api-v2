import { Customer } from "@entities/customer/customer"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindCustomerAllInputPort
      extends UseCase<void, Customer[]> {}
