import { CreateOrderItemOutputPort } from "@application/ports/output/order-item/create-order-item-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaCreateOrderItemOutputPort
    implements CreateOrderItemOutputPort
{
    async create(
        orderItem: {
            orderId: number
            productId: number
            productName: string
            unitPrice: number
            quantity: number
        }
    ): Promise<OrderItem> {
        const created = await prisma.orderItem.create({ data: orderItem })
        // Rehydrate domain OrderItem (db ids -> string ids)
        return new OrderItem(
            created.id.toString(),
            created.orderId.toString(),
            created.productId.toString(),
            created.productName,
            created.unitPrice,
            created.quantity,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible alias (legacy tests/imports)
export class PrismaCreateOrderItemRepository extends PrismaCreateOrderItemOutputPort {}
