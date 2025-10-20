import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { Payment } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdatePaymentOutputPort implements UpdatePaymentOutputPort {
    async execute(param: {
        id: Payment["id"]
        orderId?: Payment["orderId"]
        amount?: Payment["amount"]
        paymentStatus?: Payment["paymentStatus"]
        paidAt?: Payment["paidAt"]
    }): Promise<Payment | null> {
        const { id, orderId, amount, paymentStatus, paidAt } = param
        const payment = await prisma.payment.findUnique({ where: { id } })
        if (!payment) return null
        const updateData: any = { updatedAt: new Date() }
        if (orderId !== undefined) updateData.orderId = orderId
        if (amount !== undefined) updateData.amount = amount
        if (paymentStatus !== undefined)
            updateData.paymentStatus = paymentStatus
        if (paidAt !== undefined) updateData.paidAt = paidAt
        const updated = await prisma.payment.update({
            where: { id },
            data: updateData,
        })
        return updated as Payment
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
