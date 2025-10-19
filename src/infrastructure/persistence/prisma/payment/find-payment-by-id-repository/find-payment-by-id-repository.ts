import { FindPaymentByIdOutputPort } from "@application/ports/output/payment/find-payment-by-id-output-port"
import { Payment } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindPaymentByIdOutputPort
    implements FindPaymentByIdOutputPort
{
    async execute(id: Payment["id"]): Promise<Payment | null> {
        const payment = await prisma.payment.findUnique({ where: { id } })
        return payment as Payment | null
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
