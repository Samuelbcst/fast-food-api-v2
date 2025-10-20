import { Payment, PaymentStatus } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface UpdatePaymentCommand {
    id: number
    orderId?: number
    amount?: number
    paymentStatus?: PaymentStatus
    paidAt?: Date | null
}

export interface UpdatePaymentInputPort
    extends UseCase<UpdatePaymentCommand, Payment> {}
