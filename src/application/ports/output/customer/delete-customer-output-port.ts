import { Customer } from "@entities/customer/customer"

/**
 * Output Port for deleting a customer
 * Defines the contract that infrastructure adapters must implement
 */
export interface DeleteCustomerOutputPort {
    execute(id: number): Promise<Customer | null>
    finish(): Promise<void>
}
