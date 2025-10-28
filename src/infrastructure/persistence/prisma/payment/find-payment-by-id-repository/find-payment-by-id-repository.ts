import { FindPaymentByIdOutputPort } from "@application/ports/output/payment/find-payment-by-id-output-port"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindPaymentByIdOutputPort implements FindPaymentByIdOutputPort {
    async execute(id: number): Promise<Payment | null> {
        const payment = await prisma.payment.findUnique({ where: { id } })
        if (!payment) return null
        return new Payment(payment.id.toString(), payment.orderId.toString(), payment.amount, payment.paymentStatus as unknown as PaymentStatus, payment.paidAt ?? null, false)
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible alias for older imports/tests
export class PrismaFindPaymentByIdRepository extends PrismaFindPaymentByIdOutputPort {}
