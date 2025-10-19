import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaDeletePaymentRepository } from "./delete-payment-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        payment: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const fakePayment = {
    id: 1,
    orderId: 2,
    paymentStatus: "PAID",
    paidAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("PrismaDeletePaymentRepository", () => {
    let repository: PrismaDeletePaymentRepository

    beforeEach(() => {
        repository = new PrismaDeletePaymentRepository()
        vi.clearAllMocks()
    })

    it("should delete and return the payment if found", async () => {
        ;(prisma.payment.findUnique as any)
            .mockResolvedValue(fakePayment)(prisma.payment.delete as any)
            .mockResolvedValue(undefined)
        const result = await repository.execute({ id: 1 })
        expect(prisma.payment.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.payment.delete).toHaveBeenCalledWith({ where: { id: 1 } })
        expect(result).toEqual(fakePayment)
    })

    it("should return null if payment not found", async () => {
        ;(prisma.payment.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 99 })
        expect(prisma.payment.findUnique).toHaveBeenCalledWith({
            where: { id: 99 },
        })
        expect(prisma.payment.delete).not.toHaveBeenCalled()
        expect(result).toBeNull()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
