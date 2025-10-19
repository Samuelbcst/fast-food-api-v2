import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindPaymentByIdCommand {
    id: number
}

export interface FindPaymentByIdInputPort
    extends UseCase<FindPaymentByIdCommand, Payment> {}
