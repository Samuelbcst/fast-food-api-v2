import { FindOrderByCustomerOutputPort } from "@application/ports/output/order/find-order-by-customer-output-port"
import { Order } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindOrderByCustomerOutputPort
    implements FindOrderByCustomerOutputPort
{
    async execute(customerId: number): Promise<Order[]> {
        const orders = await prisma.order.findMany({
            where: { customerId },
            include: { items: true },
        })
        return orders.map((order) => ({
            ...order,
            items: order.items ?? [],
        })) as Order[]
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
