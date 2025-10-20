import { FindOrderAllOutputPort } from "@application/ports/output/order/find-order-all-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderAllOutputPort implements FindOrderAllOutputPort {
    async execute(): Promise<Order[]> {
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    not: OrderStatus.FINISHED,
                },
            },
            include: { items: true },
        })

        const normalized = orders.map((order) => ({
            ...order,
            items: order.items ?? [],
        })) as Order[]

        const priority: Record<OrderStatus, number> = {
            [OrderStatus.READY]: 0,
            [OrderStatus.PREPARING]: 1,
            [OrderStatus.RECEIVED]: 2,
            [OrderStatus.FINISHED]: 3,
        }

        normalized.sort((a, b) => {
            const statusDiff =
                (priority[a.status] ?? Number.MAX_SAFE_INTEGER) -
                (priority[b.status] ?? Number.MAX_SAFE_INTEGER)
            if (statusDiff !== 0) return statusDiff
            return (
                a.createdAt.getTime?.() ?? new Date(a.createdAt).getTime() -
                (b.createdAt.getTime?.() ?? new Date(b.createdAt).getTime())
            )
        })

        return normalized
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
