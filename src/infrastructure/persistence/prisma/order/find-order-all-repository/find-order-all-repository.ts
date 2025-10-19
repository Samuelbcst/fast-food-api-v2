import { FindOrderAllOutputPort } from "@application/ports/output/order/find-order-all-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderAllOutputPort implements FindOrderAllOutputPort {
    async execute(): Promise<Order[]> {
        const orders = await prisma.order.findMany({ include: { items: true } })
        return orders.map((order) => ({
            ...order,
            items: order.items ?? [],
        })) as Order[]
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
