import { OrderStatus } from "@entities/order/order"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { UseCase } from "@application/use-cases/base-use-case"

export interface ProcessPaymentWebhookCommand {
    orderId: number
    status: PaymentStatus
    paidAt?: Date | null
}

export interface ProcessPaymentWebhookInputPort
    extends UseCase<ProcessPaymentWebhookCommand, {
        payment: Payment
        orderStatus?: OrderStatus
    }> {}
