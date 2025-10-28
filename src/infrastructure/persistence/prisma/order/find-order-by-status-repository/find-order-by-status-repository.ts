import { FindOrderByStatusOutputPort } from "@application/ports/output/order/find-order-by-status-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderByStatusOutputPort
    implements FindOrderByStatusOutputPort
{
    async execute(status: OrderStatus): Promise<Order[]> {
        const orders = (await prisma.order.findMany({
            where: { status: (status as unknown) as any },
            include: { items: true },
        })) as any[]

        return orders.map((order: any) => {
            const items = (order.items ?? []).map(
                (it: any) =>
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

// Backwards-compatible class alias (legacy tests/imports)
export class PrismaFindOrderByStatusRepository extends PrismaFindOrderByStatusOutputPort {}
