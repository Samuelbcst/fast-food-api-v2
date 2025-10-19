import { CreateOrderItemCommand, CreateOrderItemInputPort } from "@application/ports/input/order-item/create-order-item-input"
import { CreateOrderItemOutputPort } from "@application/ports/output/order-item/create-order-item-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class CreateOrderItemUseCase implements CreateOrderItemInputPort {
    constructor(private createOrderItemOutputPort: CreateOrderItemOutputPort) {}

    async execute(input: CreateOrderItemCommand) {
        try {
            const created = await this.createOrderItemOutputPort.create(input)
            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to create order item"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createOrderItemOutputPort.finish()
    }
}
