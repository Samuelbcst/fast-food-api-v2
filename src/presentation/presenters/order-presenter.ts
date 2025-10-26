import { UseCaseResult } from "@application/use-cases/use-case-result"
import { Order, OrderStatus } from "@entities/order/order"
import { PresentationResponse, Presenter } from "./presenter"

/**
 * Order view model
 */
export interface OrderViewModel {
    id: string | number
    customerId?: string | number
    status: OrderStatus
    totalAmount: number
    pickupCode?: string
    createdAt?: Date
    updatedAt?: Date
    statusUpdatedAt?: Date
}

/**
 * Order Presenter
 */
export class OrderPresenter
    implements Presenter<Order, PresentationResponse<OrderViewModel>>
{
    present(
        result: UseCaseResult<Order>
    ): PresentationResponse<OrderViewModel> {
        if (result.success && result.result) {
            const order = result.result
            return {
                data: {
                    id: order.id,
                    customerId: order.customerId,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    pickupCode: order.pickupCode,
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
 * Order List Presenter
 */
export class OrderListPresenter
    implements Presenter<Order[], PresentationResponse<OrderViewModel[]>>
{
    present(
        result: UseCaseResult<Order[]>
    ): PresentationResponse<OrderViewModel[]> {
        if (result.success && result.result) {
            const orders = result.result
            return {
                data: orders.map((o) => ({
                    id: o.id,
                    customerId: o.customerId,
                    status: o.status,
                    totalAmount: o.totalAmount,
                    pickupCode: o.pickupCode,
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
