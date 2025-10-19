import { FindPaymentAllOutputPort } from "@application/ports/output/payment/find-payment-all-output-port"
import { Payment } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindPaymentAllOutputPort
    implements FindPaymentAllOutputPort
{
    async execute(): Promise<Payment[]> {
        const payments = await prisma.payment.findMany()
        return payments as Payment[]
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
