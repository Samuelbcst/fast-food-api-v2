import { Customer } from "@entities/customer/customer"

/**
 * Output Port for updating a customer
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateCustomerOutputPort {
    execute(input: {
        id: number
        name?: string
        email?: string
        cpf?: string
    }): Promise<Customer | null>
    finish(): Promise<void>
}
