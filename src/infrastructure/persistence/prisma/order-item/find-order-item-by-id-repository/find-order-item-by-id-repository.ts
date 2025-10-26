import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderItemByIdOutputPort
    implements FindOrderItemByIdOutputPort
{
    async execute(id: number): Promise<OrderItem | null> {
        const item = await prisma.orderItem.findUnique({ where: { id } })
        if (!item) return null
        return new OrderItem(
            item.id.toString(),
            item.orderId.toString(),
            item.productId.toString(),
            item.productName,
            item.unitPrice,
            item.quantity,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
