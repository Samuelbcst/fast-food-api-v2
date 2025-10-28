import { FindOrderByStatusCommand, FindOrderByStatusInputPort } from "@application/ports/input/order/find-order-by-status-input"
import { FindOrderByStatusOutputPort } from "@application/ports/output/order/find-order-by-status-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindOrderByStatusUseCase implements FindOrderByStatusInputPort {
    constructor(private readonly repository: FindOrderByStatusOutputPort) {}

    async execute(input: FindOrderByStatusCommand) {
        try {
            // Adapter boundary: cast incoming string to OrderStatus enum
            const orders = await this.repository.execute(
                (input.status as unknown) as import("@entities/order/order").OrderStatus
            )
            if (!orders || orders.length === 0) {
                return {
                    success: false,
                    result: [],
                    error: new CustomError(
                    "No orders found for this status.",
                    404
                ),
                }
            }
            return {
                success: true,
                result: orders,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
                error: new CustomError(
                    (error as Error)?.message || "Failed to find orders by status",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
