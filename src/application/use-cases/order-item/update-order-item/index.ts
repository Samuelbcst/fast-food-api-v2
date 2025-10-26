import { UpdateOrderItemCommand, UpdateOrderItemInputPort } from "@application/ports/input/order-item/update-order-item-input"
import { UpdateOrderItemOutputPort } from "@application/ports/output/order-item/update-order-item-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class UpdateOrderItemUseCase implements UpdateOrderItemInputPort {
    constructor(private updateOrderItemOutputPort: UpdateOrderItemOutputPort) {}

    async execute(input: UpdateOrderItemCommand) {
        try {
            const orderItem =
                await this.updateOrderItemOutputPort.execute(input)

            if (!orderItem) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Product not found.", 404),
                }
            }

            return {
                success: true,
                result: orderItem,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.updateOrderItemOutputPort.finish()
    }
}
