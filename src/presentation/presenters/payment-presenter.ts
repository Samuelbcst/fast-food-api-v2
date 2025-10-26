import { UseCaseResult } from "@application/use-cases/use-case-result"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import {
    ErrorResponse,
    PresentationResponse,
    Presenter,
    SuccessResponse,
} from "./presenter"

/**
 * Payment view model
 */
export interface PaymentViewModel {
    id: string | number
    orderId: number
    amount: number
    paymentStatus: PaymentStatus
    paidAt: Date
    createdAt?: Date
    updatedAt?: Date
}

/**
 * Payment Presenter
 */
export class PaymentPresenter
    implements Presenter<Payment, PresentationResponse<PaymentViewModel>>
{
    present(
        result: UseCaseResult<Payment>
    ): PresentationResponse<PaymentViewModel> {
        if (result.success && result.result) {
            const payment = result.result
            return {
                data: {
                    id: payment.id,
                    orderId: payment.orderId,
                    amount: payment.amount,
                    paymentStatus: payment.paymentStatus,
                    paidAt: payment.paidAt,
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
 * Payment List Presenter
 */
export class PaymentListPresenter
    implements Presenter<Payment[], PresentationResponse<PaymentViewModel[]>>
{
    present(
        result: UseCaseResult<Payment[]>
    ): PresentationResponse<PaymentViewModel[]> {
        if (result.success && result.result) {
            const payments = result.result
            return {
                data: payments.map((p) => ({
                    id: p.id,
                    orderId: p.orderId,
                    amount: p.amount,
                    paymentStatus: p.paymentStatus,
                    paidAt: p.paidAt,
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
