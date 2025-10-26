import { Customer } from "@entities/customer/customer"

/**
 * Output Port for finding a customer by ID
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindCustomerByIdOutputPort {
    // Adapter boundary uses DB numeric id
    execute(id: number): Promise<Customer | null>
    finish(): Promise<void>
}
