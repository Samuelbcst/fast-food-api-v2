import { Payment } from "@entities/payment/payment"

/**
 * Output Port for finding a payment by ID
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindPaymentByIdOutputPort {
    execute(id: number): Promise<Payment | null>
    finish(): Promise<void>
}
