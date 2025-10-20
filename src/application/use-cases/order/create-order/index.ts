import { CreateOrderCommand, CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { OrderStatus } from "@entities/order/order"
import { CustomError } from "@application/use-cases/custom-error"

export class CreateOrderUseCase implements CreateOrderInputPort {
    constructor(
        private readonly createOrderOutputPort: CreateOrderOutputPort,
        private readonly findProductByIdOutputPort: FindProductByIdOutputPort
    ) {}

    async execute(input: CreateOrderCommand) {
        if (!input.items || input.items.length === 0) {
            return {
                success: false,
                result: null,
                error: new CustomError(400, "Order must contain at least one item"),
            }
        }

        try {
            const now = new Date()
            const items = []
            let totalAmount = 0

            for (const item of input.items) {
                const product = await this.findProductByIdOutputPort.execute(
                    item.productId
                )
                if (!product) {
                    return {
                        success: false,
                        result: null,
                        error: new CustomError(
                            404,
                            `Product not found: ${item.productId}`
                        ),
                    }
                }

                const lineTotal = product.price * item.quantity
                totalAmount += lineTotal
                items.push({
                    productId: product.id,
                    productName: product.name,
                    unitPrice: product.price,
                    quantity: item.quantity,
                })
            }

            const created = await this.createOrderOutputPort.create({
                customerId: input.customerId,
                status: OrderStatus.RECEIVED,
                statusUpdatedAt: now,
                totalAmount,
                items,
            })
            return {
                success: true,
                result: { id: created.id },
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
        return Promise.allSettled([
            this.createOrderOutputPort.finish(),
            this.findProductByIdOutputPort.finish(),
        ]).then(() => undefined)
    }
}
