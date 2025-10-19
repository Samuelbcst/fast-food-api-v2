import { DeleteOrderOutputPort } from "@application/ports/output/order/delete-order-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaDeleteOrderOutputPort implements DeleteOrderOutputPort {
    async execute(id: number): Promise<Order | null> {
        const order = await prisma.order.findUnique({ where: { id } })
        if (!order) return null
        await prisma.order.delete({ where: { id } })
        return { ...order, items: [] } as Order
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
