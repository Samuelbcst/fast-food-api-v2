import { BaseEntity } from "@entities/base-entity"
import { Customer } from "@entities/customer/customer"

/**
 * Output Port for creating a customer
 * Defines the contract that infrastructure adapters must implement
 */
export interface CreateCustomerOutputPort {
    create(input: Omit<Customer, keyof BaseEntity>): Promise<Customer>
    finish(): Promise<void>
}
