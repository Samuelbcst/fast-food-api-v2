import { BaseEntity } from "@entities/base-entity"
import { Payment } from "@entities/payment/payment"

/**
 * Output Port for creating a payment
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreatePaymentOutputPort {
    create(input: Omit<Payment, keyof BaseEntity>): Promise<Payment>
    finish(): Promise<void>
}
