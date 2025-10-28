import { FindPaymentAllOutputPort } from "@application/ports/output/payment/find-payment-all-output-port"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindPaymentAllOutputPort implements FindPaymentAllOutputPort {
    async execute(): Promise<Payment[]> {
        const payments = await prisma.payment.findMany()
        return payments.map(
            (p) =>
                new Payment(p.id.toString(), p.orderId.toString(), p.amount, p.paymentStatus as unknown as PaymentStatus, p.paidAt ?? null, false)
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible alias
export class PrismaFindPaymentAllRepository extends PrismaFindPaymentAllOutputPort {}
