import { UpdateOrderItemOutputPort } from "@application/ports/output/order-item/update-order-item-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateOrderItemOutputPort
    implements UpdateOrderItemOutputPort
{
    async execute(param: {
        id: OrderItem["id"]
        quantity?: OrderItem["quantity"]
        price?: OrderItem["unitPrice"]
        orderId?: OrderItem["orderId"]
        productId?: OrderItem["productId"]
    }): Promise<OrderItem | null> {
        const { id, quantity, price, orderId, productId } = param
        const orderItem = await prisma.orderItem.findUnique({ where: { id } })
        if (!orderItem) return null
        const updateData: any = { updatedAt: new Date() }
        if (quantity !== undefined) updateData.quantity = quantity
        if (price !== undefined) updateData.unitPrice = price
        if (orderId !== undefined) updateData.orderId = orderId
        if (productId !== undefined) updateData.productId = productId
        const updated = await prisma.orderItem.update({
            where: { id },
            data: updateData,
        })
        return updated as OrderItem
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
