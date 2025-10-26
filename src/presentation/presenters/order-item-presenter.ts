import { UseCaseResult } from "@application/use-cases/use-case-result"
import { OrderItem } from "@entities/order-item/order-item"
import { PresentationResponse, Presenter } from "./presenter"

/**
 * OrderItem view model
 */
export interface OrderItemViewModel {
    id: string | number
    orderId: string | number
    productId: string | number
    productName: string
    unitPrice: number
    quantity: number
    createdAt?: Date
    updatedAt?: Date
}

/**
 * OrderItem Presenter
 */
export class OrderItemPresenter
    implements Presenter<OrderItem, PresentationResponse<OrderItemViewModel>>
{
    present(
        result: UseCaseResult<OrderItem>
    ): PresentationResponse<OrderItemViewModel> {
        if (result.success && result.result) {
            const item = result.result
            return {
                data: {
                    id: item.id,
                    orderId: item.orderId,
                    productId: item.productId,
                    productName: item.productName,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
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
 * OrderItem List Presenter
 */
export class OrderItemListPresenter
    implements
        Presenter<OrderItem[], PresentationResponse<OrderItemViewModel[]>>
{
    present(
        result: UseCaseResult<OrderItem[]>
    ): PresentationResponse<OrderItemViewModel[]> {
        if (result.success && result.result) {
            const items = result.result
            return {
                data: items.map((i) => ({
                    id: i.id,
                    orderId: i.orderId,
                    productId: i.productId,
                    productName: i.productName,
                    unitPrice: i.unitPrice,
                    quantity: i.quantity,
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
