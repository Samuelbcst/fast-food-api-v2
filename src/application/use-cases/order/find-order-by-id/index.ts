import { FindOrderByIdCommand, FindOrderByIdInputPort } from "@application/ports/input/order/find-order-by-id-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindOrderByIdUseCase implements FindOrderByIdInputPort {
    constructor(private readonly repository: FindOrderByIdOutputPort) {}

    async execute(input: FindOrderByIdCommand) {
        try {
            const order = await this.repository.execute(input.id)
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
                    (error as Error)?.message || "Failed to find order"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
