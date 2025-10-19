import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdatePaymentCommand {
    id: number
    orderId?: number
    amount?: number
    paymentStatus?: string
    paidAt?: Date
}

export interface UpdatePaymentInputPort
    extends UseCase<UpdatePaymentCommand, Payment> {}
