import { PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreatePaymentRepository } from "./create-payment-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        payment: {
            create: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const paymentData = {
    orderId: 1,
    amount: 100,
    paymentStatus: PaymentStatus.PAID,
    paidAt: new Date(),
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("PrismaCreatePaymentRepository", () => {
    let repository: PrismaCreatePaymentRepository

    beforeEach(() => {
        repository = new PrismaCreatePaymentRepository()
        vi.clearAllMocks()
    })

    it("should create and return a payment", async () => {
        ;(prisma.payment.create as any).mockResolvedValue(paymentData)
        const result = await repository.create(paymentData)
        expect(prisma.payment.create).toHaveBeenCalledWith({
            data: paymentData,
        })
        expect(result).toEqual(paymentData)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
