import { UpdateOrderItemOutputPort } from "@application/ports/output/order-item/update-order-item-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateOrderItemOutputPort
    implements UpdateOrderItemOutputPort
{
    async execute(param: {
        id: number
        quantity?: number
        price?: number
        orderId?: number
        productId?: number
    }): Promise<OrderItem | null> {
        const { id, quantity, price, orderId, productId } = param
        const orderItem = await prisma.orderItem.findUnique({ where: { id } })
        if (!orderItem) return null
        const updateData: any = { updatedAt: new Date() }
        if (quantity !== undefined) updateData.quantity = quantity
        if (price !== undefined) updateData.unitPrice = price
        if (orderId !== undefined) updateData.orderId = orderId
        if (productId !== undefined) updateData.productId = productId
        const updated = await prisma.orderItem.update({ where: { id }, data: updateData })
        return new OrderItem(
            updated.id.toString(),
            updated.orderId.toString(),
            updated.productId.toString(),
            updated.productName,
            updated.unitPrice,
            updated.quantity,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
// Backwards-compatible class alias
export class PrismaUpdateOrderItemRepository extends PrismaUpdateOrderItemOutputPort {}
