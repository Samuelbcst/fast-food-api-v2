import { UpdateOrderOutputPort } from "@application/ports/output/order/update-order-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateOrderOutputPort implements UpdateOrderOutputPort {
    async execute(param: {
        id: Order["id"]
        customerId?: Order["customerId"]
        items?: Order["items"]
        status?: Order["status"]
        statusUpdatedAt?: Order["statusUpdatedAt"]
        totalAmount?: Order["totalAmount"]
        pickupCode?: Order["pickupCode"]
    }): Promise<Order | null> {
        const {
            id,
            customerId,
            items,
            status,
            statusUpdatedAt,
            totalAmount,
            pickupCode,
        } = param
        // Find the order first
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        })
        if (!order) return null

        // Prepare update data
        const updateData: any = { updatedAt: new Date() }
        if (customerId !== undefined) updateData.customerId = customerId
        if (status !== undefined) updateData.status = status
        if (statusUpdatedAt !== undefined)
            updateData.statusUpdatedAt = statusUpdatedAt
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
        return { ...updatedOrder, items: updatedOrder.items ?? [] } as Order
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
