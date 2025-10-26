import { Customer } from "@entities/customer/customer"

/**
 * Output Port for updating a customer
 * Defines the contract that infrastructure adapters must implement
 */
export interface UpdateCustomerOutputPort {
    execute(input: {
        id: number
        name?: Customer["name"]
        email?: Customer["email"]
        cpf?: Customer["cpf"]
    }): Promise<Customer | null>
    finish(): Promise<void>
}
