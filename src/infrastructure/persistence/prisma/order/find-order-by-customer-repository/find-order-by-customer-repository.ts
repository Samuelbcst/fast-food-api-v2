import { FindOrderByCustomerOutputPort } from "@application/ports/output/order/find-order-by-customer-output-port"
import { Order, OrderStatus } from "@entities/order/order"
import { OrderItem } from "@entities/order-item/order-item"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderByCustomerOutputPort
    implements FindOrderByCustomerOutputPort
{
    async execute(customerId: number): Promise<Order[]> {
        const orders = await prisma.order.findMany({
            where: { customerId },
            include: { items: true },
        })

        return orders.map((order) => {
            const items = (order.items ?? []).map(
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
                items,
                (order.status as unknown) as OrderStatus,
                order.totalAmount,
                order.pickupCode ?? undefined,
                false
            )
        })
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
