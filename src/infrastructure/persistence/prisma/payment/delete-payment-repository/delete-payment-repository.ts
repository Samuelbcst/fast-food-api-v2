import { DeletePaymentOutputPort } from "@application/ports/output/payment/delete-payment-output-port"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaDeletePaymentOutputPort implements DeletePaymentOutputPort {
    // Overloads: support numeric id (interface) and legacy { id } object used in tests
    async execute(id: number): Promise<Payment | null>
    async execute(param: { id: number }): Promise<Payment | null>
    async execute(idOrParam: any): Promise<Payment | null> {
        const id = typeof idOrParam === "object" ? idOrParam.id : idOrParam
        const payment = await prisma.payment.findUnique({ where: { id } })
        if (!payment) return null
        await prisma.payment.delete({ where: { id } })
        return new Payment(payment.id.toString(), payment.orderId.toString(), payment.amount, payment.paymentStatus as unknown as PaymentStatus, payment.paidAt ?? null, false)
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible alias
export class PrismaDeletePaymentRepository extends PrismaDeletePaymentOutputPort {}
