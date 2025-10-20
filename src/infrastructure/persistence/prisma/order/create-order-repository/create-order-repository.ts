import { CreateOrderOutputPort, CreateOrderPersistenceInput } from "@application/ports/output/order/create-order-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaCreateOrderOutputPort implements CreateOrderOutputPort {
    async create(input: CreateOrderPersistenceInput): Promise<Order> {
        const { customerId, status, totalAmount, statusUpdatedAt, pickupCode, items } =
            input
        const order = await prisma.order.create({
            data: {
                customerId,
                status,
                totalAmount,
                statusUpdatedAt,
                pickupCode,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: true },
        })
        return {
            ...order,
            items: order.items ?? [],
        } as Order
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
