import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindPaymentAllInputPort
    extends UseCase<void, Payment[]> {}
