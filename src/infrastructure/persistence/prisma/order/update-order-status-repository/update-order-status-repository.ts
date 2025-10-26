import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateOrderStatusOutputPort
    implements UpdateOrderStatusOutputPort
{
    async execute(param: { id: number; status: OrderStatus }): Promise<Order | null> {
        const { id, status } = param
        const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
        if (!order) return null
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: (status as unknown) as any,
                statusUpdatedAt: new Date(),
                updatedAt: new Date(),
            },
            include: { items: true },
        })

        const domainItems = (updatedOrder.items ?? []).map(
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
            updatedOrder.id.toString(),
            updatedOrder.customerId?.toString() ?? undefined,
            domainItems,
            (updatedOrder.status as unknown) as OrderStatus,
            updatedOrder.totalAmount,
            updatedOrder.pickupCode ?? undefined,
            false
        )
    }

    async finish() {
        await prisma.$disconnect()
    }
}
