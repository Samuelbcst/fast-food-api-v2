import { Customer } from "@entities/customer/customer"

/**
 * Output Port for finding all customers
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindCustomerAllOutputPort {
    execute(): Promise<Customer[]>
    finish(): Promise<void>
}
