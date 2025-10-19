import { Payment } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"
import { BaseEntity } from "@entities/base-entity"

export interface CreatePaymentCommand extends Omit<Payment, keyof BaseEntity> {}

export interface CreatePaymentInputPort
    extends UseCase<CreatePaymentCommand, Payment> {}
