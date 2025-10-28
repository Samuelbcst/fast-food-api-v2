import { UpdateOrderCommand, UpdateOrderInputPort } from "@application/ports/input/order/update-order-input"
import { UpdateOrderOutputPort } from "@application/ports/output/order/update-order-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class UpdateOrderUseCase implements UpdateOrderInputPort {
    constructor(private readonly repository: UpdateOrderOutputPort) {}

    async execute(input: UpdateOrderCommand) {
        try {
            const order = await this.repository.execute(input)
            if (!order) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order not found.", 404),
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
                    (error as Error)?.message || "Failed to update order",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
