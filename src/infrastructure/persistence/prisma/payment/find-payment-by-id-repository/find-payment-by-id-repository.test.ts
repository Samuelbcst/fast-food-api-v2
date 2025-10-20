import { PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindPaymentByIdRepository } from "./find-payment-by-id-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        payment: {
            findUnique: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindPaymentByIdRepository", () => {
    let repository: PrismaFindPaymentByIdRepository

    beforeEach(() => {
        repository = new PrismaFindPaymentByIdRepository()
        vi.clearAllMocks()
    })

    it("should return the payment if found", async () => {
        const fakePayment = {
            id: 1,
            orderId: 2,
            paymentStatus: PaymentStatus.APPROVED,
            paidAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        ;(prisma.payment.findUnique as any).mockResolvedValue(fakePayment)
        const result = await repository.execute(1)
        expect(prisma.payment.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(result).toEqual(fakePayment)
    })

    it("should return null if payment not found", async () => {
        ;(prisma.payment.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute(99)
        expect(prisma.payment.findUnique).toHaveBeenCalledWith({
            where: { id: 99 },
        })
        expect(result).toBeNull()
    })
})
