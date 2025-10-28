import { Payment, PaymentStatus } from "@entities/payment/payment"

/**
 * Output Port for creating a payment
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreatePaymentOutputPort {
    create(input: { orderId: number; amount: number; paymentStatus: PaymentStatus; paidAt?: Date | null }): Promise<Payment>
    finish(): Promise<void>
}
