import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { Payment } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindPaymentByOrderIdOutputPort
    implements FindPaymentByOrderIdOutputPort
{
    async execute(orderId: number): Promise<Payment | null> {
        const payment = await prisma.payment.findUnique({ where: { orderId } })
        return payment as Payment | null
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
