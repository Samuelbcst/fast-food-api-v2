import { FindOrderAllOutputPort } from "@application/ports/output/order/find-order-all-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
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

        // Sort using DB fields then map to domain Order objects
        const priority: Record<string, number> = {
            [OrderStatus.READY]: 0,
            [OrderStatus.PREPARING]: 1,
            [OrderStatus.RECEIVED]: 2,
            [OrderStatus.FINISHED]: 3,
        }

        orders.sort((a, b) => {
            const statusDiff =
                (priority[a.status as unknown as string] ?? Number.MAX_SAFE_INTEGER) -
                (priority[b.status as unknown as string] ?? Number.MAX_SAFE_INTEGER)
            if (statusDiff !== 0) return statusDiff
            const aTime = a.createdAt?.getTime?.() ?? new Date(a.createdAt).getTime()
            const bTime = b.createdAt?.getTime?.() ?? new Date(b.createdAt).getTime()
            return aTime - bTime
        })

        return orders.map((order) => {
            const items = (order.items ?? []).map(
                (it) =>
                    new OrderItem(
                        it.id.toString(),
                        it.orderId.toString(),
                        it.productId.toString(),
                        it.productName,
                        it.unitPrice,
                        it.quantity,
                        false
                    )
            )
            return new Order(
                order.id.toString(),
                order.customerId?.toString() ?? undefined,
                items,
                (order.status as unknown) as OrderStatus,
                order.totalAmount,
                order.pickupCode ?? undefined,
                false
            )
        })
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
