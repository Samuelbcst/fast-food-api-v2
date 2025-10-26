import {
    CreateOrderOutputPort,
    CreateOrderPersistenceInput,
} from "@application/ports/output/order/create-order-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaCreateOrderOutputPort implements CreateOrderOutputPort {
    async create(input: CreateOrderPersistenceInput): Promise<Order> {
        const {
            customerId,
            status,
            totalAmount,
            statusUpdatedAt,
            pickupCode,
            items,
        } = input
        const order = await prisma.order.create({
            data: {
                customerId,
                status: status as unknown as any,
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

        const domainItems = (order.items ?? []).map(
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
            order.id.toString(),
            order.customerId?.toString() ?? undefined,
            domainItems,
            (order.status as unknown) as OrderStatus,
            order.totalAmount,
            order.pickupCode ?? undefined,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
