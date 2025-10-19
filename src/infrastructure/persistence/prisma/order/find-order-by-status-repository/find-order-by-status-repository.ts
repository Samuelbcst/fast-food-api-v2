import { FindOrderByStatusOutputPort } from "@application/ports/output/order/find-order-by-status-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderByStatusOutputPort
    implements FindOrderByStatusOutputPort
{
    async execute(status: string): Promise<Order[]> {
        const orders = await prisma.order.findMany({
            where: { status: status as OrderStatus },
            include: { items: true },
        })
        return orders.map((order) => ({
            ...order,
            items: order.items ?? [],
        })) as Order[]
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
