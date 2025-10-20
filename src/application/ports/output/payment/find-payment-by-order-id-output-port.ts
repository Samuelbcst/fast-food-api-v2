import { Payment } from "@entities/payment/payment"

export interface FindPaymentByOrderIdOutputPort {
    execute(orderId: number): Promise<Payment | null>
    finish(): Promise<void>
}
