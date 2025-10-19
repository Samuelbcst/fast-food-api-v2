import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderByIdOutputPort implements FindOrderByIdOutputPort {
    async execute(id: Order["id"]): Promise<Order | null> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        })
        if (!order) return null
        return { ...order, items: order.items ?? [] } as Order
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
