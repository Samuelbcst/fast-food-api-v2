import { FindOrderByCustomerCommand, FindOrderByCustomerInputPort } from "@application/ports/input/order/find-order-by-customer-input"
import { FindOrderByCustomerOutputPort } from "@application/ports/output/order/find-order-by-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindOrderByCustomerUseCase implements FindOrderByCustomerInputPort {
    constructor(private readonly repository: FindOrderByCustomerOutputPort) {}

    async execute(input: FindOrderByCustomerCommand) {
        try {
            const orders = await this.repository.execute(input.customerId)
            if (!orders || orders.length === 0) {
                return {
                    success: false,
                    result: [],
                    error: new CustomError(
                        404,
                        "No orders found for this customer."
                    ),
                }
            }
            return {
                success: true,
                result: orders,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
                error: new CustomError(
                    400,
                    (error as Error)?.message || "Failed to find orders"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
