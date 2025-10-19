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
        return orderItem as OrderItem
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
