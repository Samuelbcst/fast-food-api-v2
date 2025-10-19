import { Payment } from "@entities/payment/payment"

/**
 * Output Port for finding all payments
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindPaymentAllOutputPort {
    execute(): Promise<Payment[]>
    finish(): Promise<void>
}
