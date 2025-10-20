import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface FindPaymentByOrderIdCommand {
    orderId: number
}

export interface FindPaymentByOrderIdInputPort
    extends UseCase<FindPaymentByOrderIdCommand, Payment | null> {}
