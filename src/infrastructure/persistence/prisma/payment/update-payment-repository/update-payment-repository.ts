import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdatePaymentOutputPort implements UpdatePaymentOutputPort {
    async execute(param: {
        id: number
        orderId?: number
        amount?: number
        paymentStatus?: PaymentStatus
        paidAt?: Date | null
    }): Promise<Payment | null> {
        const { id, orderId, amount, paymentStatus, paidAt } = param
        const payment = await prisma.payment.findUnique({ where: { id } })
        if (!payment) return null
        const updateData: any = { updatedAt: new Date() }
        if (orderId !== undefined) updateData.orderId = orderId
        if (amount !== undefined) updateData.amount = amount
        if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus as any
        if (paidAt !== undefined) updateData.paidAt = paidAt
        const updated = await prisma.payment.update({
            where: { id },
            data: updateData,
        })
        return new Payment(updated.id.toString(), updated.orderId.toString(), updated.amount, updated.paymentStatus as unknown as PaymentStatus, updated.paidAt ?? null, false)
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible alias
export class PrismaUpdatePaymentRepository extends PrismaUpdatePaymentOutputPort {}
