import { CreateOrderCommand, CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class CreateOrderUseCase implements CreateOrderInputPort {
    constructor(private createOrderOutputPort: CreateOrderOutputPort) {}

    async execute(input: CreateOrderCommand) {
        try {
            const created = await this.createOrderOutputPort.create(input)
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
                        "Failed to create order"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createOrderOutputPort.finish()
    }
}
