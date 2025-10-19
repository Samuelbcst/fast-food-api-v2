import { FindOrderAllInputPort } from "@application/ports/input/order/find-order-all-input"
import { FindOrderAllOutputPort } from "@application/ports/output/order/find-order-all-output-port"
import { CustomError } from "@application/use-cases/custom-error"

export class FindOrderAllUseCase implements FindOrderAllInputPort {
    constructor(private readonly repository: FindOrderAllOutputPort) {}

    async execute() {
        try {
            const orders = await this.repository.execute()
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
