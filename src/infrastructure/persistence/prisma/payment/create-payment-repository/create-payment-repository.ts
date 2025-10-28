import { CreatePaymentOutputPort } from "@application/ports/output/payment/create-payment-output-port"
import { Payment, PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaCreatePaymentOutputPort implements CreatePaymentOutputPort {
    async create(input: { orderId: number; amount: number; paymentStatus: PaymentStatus; paidAt?: Date | null }): Promise<Payment> {
        const payment = await prisma.payment.create({
            // Prisma typings are strict; cast the input to any so we can pass DB-shaped data during incremental migration
            data: input as any,
        })
        return new Payment(payment.id.toString(), payment.orderId.toString(), payment.amount, payment.paymentStatus as unknown as PaymentStatus, payment.paidAt ?? null, false)
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}

// Backwards-compatible constructor alias for older tests/imports
export class PrismaCreatePaymentRepository extends PrismaCreatePaymentOutputPort {}
