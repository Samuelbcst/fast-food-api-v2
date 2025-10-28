import { DeleteOrderOutputPort } from "@application/ports/output/order/delete-order-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaDeleteOrderOutputPort implements DeleteOrderOutputPort {
    async execute(id: number): Promise<Order | null> {
        const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
        if (!order) return null
        const deleted = await prisma.order.delete({ where: { id }, include: { items: true } })
        const items = (deleted.items ?? []).map(
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
            deleted.id.toString(),
            deleted.customerId?.toString() ?? undefined,
            items,
            (deleted.status as unknown) as OrderStatus,
            deleted.totalAmount,
            deleted.pickupCode ?? undefined,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible class alias (legacy tests/imports)
export class PrismaDeleteOrderRepository extends PrismaDeleteOrderOutputPort {}
