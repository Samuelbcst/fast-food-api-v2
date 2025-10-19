import { DeletePaymentOutputPort } from "@application/ports/output/payment/delete-payment-output-port"
import { Payment } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaDeletePaymentOutputPort implements DeletePaymentOutputPort {
    async execute(id: number): Promise<Payment | null> {
        const payment = await prisma.payment.findUnique({ where: { id } })
        if (!payment) return null
        await prisma.payment.delete({ where: { id } })
        return payment as Payment
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
