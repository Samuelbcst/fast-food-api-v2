import { DeleteOrderItemOutputPort } from "@application/ports/output/order-item/delete-order-item-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaDeleteOrderItemOutputPort
    implements DeleteOrderItemOutputPort
{
    async execute(id: number): Promise<OrderItem | null> {
        const orderItem = await prisma.orderItem.findUnique({ where: { id } })
        if (!orderItem) return null
        await prisma.orderItem.delete({ where: { id } })
        return new OrderItem(
            orderItem.id.toString(),
            orderItem.orderId.toString(),
            orderItem.productId.toString(),
            orderItem.productName,
            orderItem.unitPrice,
            orderItem.quantity,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
    // Backwards-compatible class alias
    export class PrismaDeleteOrderItemRepository extends PrismaDeleteOrderItemOutputPort {}
