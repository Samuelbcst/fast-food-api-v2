import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"
import { BaseEntity } from "@src/domain/entities/base-entity"

export class PrismaCreateOrderOutputPort implements CreateOrderOutputPort {
    async create(input: Omit<Order, keyof BaseEntity>): Promise<Order> {
        const { customerId, status, totalAmount, statusUpdatedAt, pickupCode } =
            input
        const order = await prisma.order.create({
            data: {
                customerId,
                status,
                totalAmount,
                statusUpdatedAt,
                pickupCode,
            },
        })
        // Return with items as empty array (since not created here)
        return {
            ...order,
            items: [],
        } as Order
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
