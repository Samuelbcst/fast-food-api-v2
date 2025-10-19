import { FindOrderItemAllInputPort } from "@application/ports/input/order-item/find-order-item-all-input"
import { FindOrderItemAllOutputPort } from "@application/ports/output/order-item/find-order-item-all-output-port"

export class FindOrderItemAllUseCase implements FindOrderItemAllInputPort {
    constructor(
        private findOrderItemAllOutputPort: FindOrderItemAllOutputPort
    ) {}

    async execute() {
        try {
            const orderItems = await this.findOrderItemAllOutputPort.execute()
            return {
                success: true,
                result: orderItems,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findOrderItemAllOutputPort.finish()
    }
}
