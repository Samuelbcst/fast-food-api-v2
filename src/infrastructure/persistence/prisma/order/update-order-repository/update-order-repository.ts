import { UpdateOrderOutputPort } from "@application/ports/output/order/update-order-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateOrderOutputPort implements UpdateOrderOutputPort {
    async execute(input: {
        id: number
        customerId?: number
        totalAmount?: number
        pickupCode?: string
        // optional DB-shaped items for replace
        items?: Array<{
            productId: number
            productName: string
            unitPrice: number
            quantity: number
        }>
    }): Promise<Order | null> {
        const { id, customerId, items, totalAmount, pickupCode } = input

        // Find the order first
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        })
        if (!order) return null

        // Prepare update data
        const updateData: any = { updatedAt: new Date() }
        if (customerId !== undefined) updateData.customerId = customerId
        if (totalAmount !== undefined) updateData.totalAmount = totalAmount
        if (pickupCode !== undefined) updateData.pickupCode = pickupCode

        // If items are provided, update them (replace all)
        let updatedOrder
        if (items !== undefined) {
            updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                    ...updateData,
                    items: {
                        set: [], // Remove all existing
                        create: items.map((item) => ({ ...item })),
                    },
                },
                include: { items: true },
            })
        } else {
            updatedOrder = await prisma.order.update({
                where: { id },
                data: updateData,
                include: { items: true },
            })
        }

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

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible class alias (legacy tests/imports)
export class PrismaUpdateOrderRepository extends PrismaUpdateOrderOutputPort {}
