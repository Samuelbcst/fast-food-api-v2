import { Customer } from "@entities/customer/customer"

/**
 * Output Port for finding a customer by CPF
 * Defines the contract that infrastructure adapters must implement
 */
export interface FindCustomerByCpfOutputPort {
    execute(cpf: string): Promise<Customer | null>
    finish(): Promise<void>
}
