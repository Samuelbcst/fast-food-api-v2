import { DeleteOrderCommand, DeleteOrderInputPort } from "@application/ports/input/order/delete-order-input"
import { DeleteOrderOutputPort } from "@application/ports/output/order/delete-order-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class DeleteOrderUseCase implements DeleteOrderInputPort {
    constructor(private deleteOrderOutputPort: DeleteOrderOutputPort) {}

    async execute(input: DeleteOrderCommand) {
        try {
            const deleted = await this.deleteOrderOutputPort.execute(input.id)
            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order not found.", 404),
                }
            }
            return {
                success: true,
                result: deleted,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.deleteOrderOutputPort.finish()
    }
}
