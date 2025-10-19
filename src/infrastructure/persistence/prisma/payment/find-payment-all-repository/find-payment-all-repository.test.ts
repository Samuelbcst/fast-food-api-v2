import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindPaymentAllRepository } from "./find-payment-all-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        payment: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindPaymentAllRepository", () => {
    let repository: PrismaFindPaymentAllRepository

    beforeEach(() => {
        repository = new PrismaFindPaymentAllRepository()
        vi.clearAllMocks()
    })

    it("should return all payments", async () => {
        const fakePayments = [
            {
                id: 1,
                orderId: 2,
                paymentStatus: "PAID",
                paidAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                orderId: 3,
                paymentStatus: "NOT_PAID",
                paidAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        ;(prisma.payment.findMany as any).mockResolvedValue(fakePayments)
        const result = await repository.execute()
        expect(prisma.payment.findMany).toHaveBeenCalled()
        expect(result).toEqual(fakePayments)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
