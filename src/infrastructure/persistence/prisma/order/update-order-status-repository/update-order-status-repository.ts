import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-output-port-status"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateOrderStatusOutputPort
    implements UpdateOrderStatusOutputPort
{
    async execute(param: {
        id: Order["id"]
        status: Order["status"]
    }): Promise<Order | null> {
        const { id, status } = param
        const order = await prisma.order.findUnique({ where: { id } })
        if (!order) return null
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status,
                statusUpdatedAt: new Date(),
                updatedAt: new Date(),
            },
            include: { items: true },
        })
        return { ...updatedOrder, items: updatedOrder.items ?? [] } as Order
    }

    async finish() {
        await prisma.$disconnect()
    }
}
