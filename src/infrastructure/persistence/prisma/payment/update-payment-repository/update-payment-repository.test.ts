import { PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaUpdatePaymentOutputPort } from "./update-payment-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        payment: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe.skip("PrismaUpdatePaymentOutputPort", () => {
    let repository: PrismaUpdatePaymentOutputPort
    let now: Date

    beforeEach(() => {
        repository = new PrismaUpdatePaymentOutputPort()
        now = new Date()
        vi.clearAllMocks()
    })

    it("should update and return the payment if found", async () => {
        const payment = {
            id: 1,
            orderId: 2,
            paymentStatus: PaymentStatus.APPROVED,
            paidAt: now,
            updatedAt: now,
            createdAt: now,
        }
        ;(prisma.payment.findUnique as any).mockResolvedValue(payment)
        const updated = {
            ...payment,
            orderId: 3,
            paymentStatus: PaymentStatus.REJECTED,
            paidAt: now,
            updatedAt: now,
        }
        ;(prisma.payment.update as any).mockResolvedValue(updated)
        const result = await repository.execute({
            id: 1,
            orderId: 3,
            amount: 50,
            paymentStatus: PaymentStatus.REJECTED,
            paidAt: now,
        })
        expect(prisma.payment.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                orderId: 3,
                amount: 50,
                paymentStatus: PaymentStatus.REJECTED,
                paidAt: now,
                updatedAt: expect.any(Date),
            }),
        })
        expect(result).toEqual(updated)
    })

    it("should return null if payment not found", async () => {
        ;(prisma.payment.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 99 })
        expect(result).toBeNull()
        expect(prisma.payment.update).not.toHaveBeenCalled()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
