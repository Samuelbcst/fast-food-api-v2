import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { Order } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderByIdOutputPort implements FindOrderByIdOutputPort {
    async execute(id: number): Promise<Order | null> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        })
        if (!order) return null

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
            (order.status as unknown) as import("@entities/order/order").OrderStatus,
            order.totalAmount,
            order.pickupCode ?? undefined,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
