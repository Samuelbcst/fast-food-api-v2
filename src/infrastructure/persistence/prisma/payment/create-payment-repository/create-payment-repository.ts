import { CreatePaymentOutputPort } from "@application/ports/output/payment/create-payment-output-port"
import { BaseEntity } from "@entities/base-entity"
import { Payment } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"

export class PrismaCreatePaymentOutputPort implements CreatePaymentOutputPort {
    async create(input: Omit<Payment, keyof BaseEntity>): Promise<Payment> {
        const payment = await prisma.payment.create({
            data: input,
        })
        return payment as Payment
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
