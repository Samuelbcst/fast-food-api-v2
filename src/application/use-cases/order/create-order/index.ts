import { CreateOrderCommand, CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { UnitOfWork } from "@application/ports/output/unit-of-work"
import { OrderStatus } from "@entities/order/order"
import { CustomError } from "@application/use-cases/custom-error"

/**
 * Create Order Use Case
 * Creates an order with multiple items within a transaction
 * Ensures atomicity: if any step fails, all changes are rolled back
 */
export class CreateOrderUseCase implements CreateOrderInputPort {
    constructor(
        private readonly createOrderOutputPort: CreateOrderOutputPort,
        private readonly findProductByIdOutputPort: FindProductByIdOutputPort,
        private readonly unitOfWork: UnitOfWork
    ) {}

    async execute(input: CreateOrderCommand) {
        if (!input.items || input.items.length === 0) {
            return {
                success: false,
                result: null,
                error: new CustomError("Order must contain at least one item", 400),
            }
        }

        try {
            // Execute all operations within a transaction
            // If any operation fails, all changes are automatically rolled back
            const result = await this.unitOfWork.execute(async () => {
                const now = new Date()
                const items = []
                let totalAmount = 0

                // Validate all products exist and calculate total
                for (const item of input.items) {
                    const product = await this.findProductByIdOutputPort.execute(
                        item.productId
                    )
                    if (!product) {
                        throw new CustomError(
                            404,
                            `Product not found: ${item.productId}`
                        )
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

                // Create the order with all items
                // This happens atomically within the transaction
                const created = await this.createOrderOutputPort.create({
                    customerId: input.customerId,
                    status: OrderStatus.RECEIVED,
                    statusUpdatedAt: now,
                    totalAmount,
                    items,
                })

                return { id: created.id }
            })

            return {
                success: true,
                result,
            }
        } catch (error: unknown) {
            // If error is CustomError, preserve the status code
            if (error instanceof CustomError) {
                return {
                    success: false,
                    result: null,
                    error,
                }
            }

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
