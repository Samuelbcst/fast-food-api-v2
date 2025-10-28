import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindPaymentByOrderIdOutputPort implements FindPaymentByOrderIdOutputPort {
    async execute(orderId: number): Promise<Payment | null> {
        // orderId is not a unique field in Prisma schema; use findFirst to obtain payment by order
        const payment = await prisma.payment.findFirst({ where: { orderId } })
        if (!payment) return null
        return new Payment(payment.id.toString(), payment.orderId.toString(), payment.amount, payment.paymentStatus as unknown as PaymentStatus, payment.paidAt ?? null, false)
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
