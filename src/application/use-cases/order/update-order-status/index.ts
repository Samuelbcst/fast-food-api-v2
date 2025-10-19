import { UpdateOrderStatusCommand, UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class UpdateOrderStatusUseCase implements UpdateOrderStatusInputPort {
    constructor(private readonly repository: UpdateOrderStatusOutputPort) {}

    async execute(input: UpdateOrderStatusCommand) {
        try {
            const order = await this.repository.execute(input)
            if (!order) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Order not found."),
                }
            }
            return {
                success: true,
                result: order,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error)?.message || "Failed to update order status"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
