import { DeleteOrderItemCommand, DeleteOrderItemInputPort } from "@application/ports/input/order-item/delete-order-item-input"
import { DeleteOrderItemOutputPort } from "@application/ports/output/order-item/delete-order-item-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class DeleteOrderItemUseCase implements DeleteOrderItemInputPort {
    constructor(private deleteOrderItemOutputPort: DeleteOrderItemOutputPort) {}

    async execute(input: DeleteOrderItemCommand) {
        try {
            const deleted = await this.deleteOrderItemOutputPort.execute(input.id)
            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Order item not found.", 404),
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
        return this.deleteOrderItemOutputPort.finish()
    }
}
