import { FindOrderItemAllOutputPort } from "@application/ports/output/order-item/find-order-item-all-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderItemAllOutputPort
    implements FindOrderItemAllOutputPort
{
    async execute(): Promise<OrderItem[]> {
        const items = await prisma.orderItem.findMany()
        return items.map((i) =>
            new OrderItem(
                i.id.toString(),
                i.orderId.toString(),
                i.productId.toString(),
                i.productName,
                i.unitPrice,
                i.quantity,
                false
            )
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
