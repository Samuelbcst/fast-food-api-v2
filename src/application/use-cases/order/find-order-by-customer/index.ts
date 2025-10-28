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
                    "No orders found for this customer.",
                    404
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
                    (error as Error)?.message || "Failed to find orders by customer",
                    400
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.repository.finish()
    }
}
