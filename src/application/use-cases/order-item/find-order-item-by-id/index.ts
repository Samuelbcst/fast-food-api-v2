import { FindOrderItemByIdCommand, FindOrderItemByIdInputPort } from "@application/ports/input/order-item/find-order-item-by-id-input"
import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindOrderItemByIdUseCase implements FindOrderItemByIdInputPort {
    constructor(
        private findOrderItemByIdOutputPort: FindOrderItemByIdOutputPort
    ) {}

    async execute(input: FindOrderItemByIdCommand) {
        try {
            const orderItem = await this.findOrderItemByIdOutputPort.execute(
                input.id
            )

            if (!orderItem) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Order item not found."),
                }
            }

            return {
                success: orderItem !== null,
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
        return this.findOrderItemByIdOutputPort.finish()
    }
}
