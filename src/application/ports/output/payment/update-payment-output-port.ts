import { Payment } from "@entities/payment/payment"
import { PaymentStatus } from "@entities/payment/payment-status"

/**
 * Output Port for updating a payment
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdatePaymentOutputPort {
    execute(input: {
        id: number
        orderId?: number
        amount?: number
        paymentStatus?: PaymentStatus
        paidAt?: Date
    }): Promise<Payment | null>
    finish(): Promise<void>
}
