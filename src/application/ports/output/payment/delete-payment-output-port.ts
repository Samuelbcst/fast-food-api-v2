import { Payment } from "@entities/payment/payment"

/**
 * Output Port for deleting a payment
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeletePaymentOutputPort {
    execute(id: number): Promise<Payment | null>
    finish(): Promise<void>
}
