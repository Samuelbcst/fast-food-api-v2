import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface DeletePaymentCommand {
    id: number
}

export interface DeletePaymentInputPort
    extends UseCase<DeletePaymentCommand, Payment | null> {}
