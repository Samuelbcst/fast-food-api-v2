import { UseCaseResult } from "@application/use-cases/use-case-result"
import { Customer } from "@entities/customer/customer"
import {
    ErrorResponse,
    PresentationResponse,
    Presenter,
    SuccessResponse,
} from "./presenter"

/**
 * Customer view model
 */
export interface CustomerViewModel {
    id: string | number
    name: string
    email: string
    cpf: string
    createdAt?: Date
    updatedAt?: Date
}

/**
 * Customer Presenter
 */
export class CustomerPresenter
    implements Presenter<Customer, PresentationResponse<CustomerViewModel>>
{
    present(
        result: UseCaseResult<Customer>
    ): PresentationResponse<CustomerViewModel> {
        if (result.success && result.result) {
            const customer = result.result
            return {
                data: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    cpf: customer.cpf,
                    // createdAt: omitted (infrastructure concern)
                    // updatedAt: omitted (infrastructure concern)
                },
                statusCode: 200,
            }
        } else {
            const error = result.error
            return {
                error: error?.name || "Error",
                message: error?.message || "An error occurred",
                statusCode: error?.statusCode || 400,
            }
        }
    }
}

/**
 * Customer List Presenter
 */
export class CustomerListPresenter
    implements Presenter<Customer[], PresentationResponse<CustomerViewModel[]>>
{
    present(
        result: UseCaseResult<Customer[]>
    ): PresentationResponse<CustomerViewModel[]> {
        if (result.success && result.result) {
            const customers = result.result
            return {
                data: customers.map((c) => ({
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    cpf: c.cpf,
                    // createdAt: omitted (infrastructure concern)
                    // updatedAt: omitted (infrastructure concern)
                })),
                statusCode: 200,
            }
        } else {
            const error = result.error
            return {
                error: error?.name || "Error",
                message: error?.message || "An error occurred",
                statusCode: error?.statusCode || 400,
            }
        }
    }
}
