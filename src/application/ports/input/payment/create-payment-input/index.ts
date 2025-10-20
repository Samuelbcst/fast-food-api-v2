import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface CreatePaymentCommand {
    orderId: number
    amount?: number
}

export interface CreatePaymentInputPort
    extends UseCase<CreatePaymentCommand, Payment> {}
