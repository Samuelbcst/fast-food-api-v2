import { FindOrderItemByIdOutputPort } from "@application/ports/output/order-item/find-order-item-by-id-output-port"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderItemByIdOutputPort
    implements FindOrderItemByIdOutputPort
{
    async execute(id: OrderItem["id"]): Promise<OrderItem | null> {
        const item = await prisma.orderItem.findUnique({ where: { id } })
        return item as OrderItem | null
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
