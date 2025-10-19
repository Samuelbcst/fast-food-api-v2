import { CreateOrderItemOutputPort } from "@application/ports/output/order-item/create-order-item-output-port"
import { BaseEntity } from "@entities/base-entity"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaCreateOrderItemOutputPort
    implements CreateOrderItemOutputPort
{
    async create(
        orderItem: Omit<OrderItem, keyof BaseEntity>
    ): Promise<OrderItem> {
        const created = await prisma.orderItem.create({
            data: orderItem,
        })
        return created as OrderItem
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
