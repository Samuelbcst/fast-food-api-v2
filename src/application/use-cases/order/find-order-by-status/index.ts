import { FindOrderByStatusCommand, FindOrderByStatusInputPort } from "@application/ports/input/order/find-order-by-status-input"
import { FindOrderByStatusOutputPort } from "@application/ports/output/order/find-order-by-status-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindOrderByStatusUseCase implements FindOrderByStatusInputPort {
    constructor(private readonly repository: FindOrderByStatusOutputPort) {}

    async execute(input: FindOrderByStatusCommand) {
        try {
            const orders = await this.repository.execute(input.status)
            if (!orders || orders.length === 0) {
                return {
                    success: false,
                    result: [],
                    error: new CustomError(
                        404,
                        "No orders found for this status."
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
                    400,
                    (error as Error)?.message || "Failed to find orders"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
