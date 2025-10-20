import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindPaymentByOrderIdOutputPort } from "./find-payment-by-order-id-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        payment: {
            findUnique: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindPaymentByOrderIdOutputPort", () => {
    let repository: PrismaFindPaymentByOrderIdOutputPort

    beforeEach(() => {
        repository = new PrismaFindPaymentByOrderIdOutputPort()
        vi.clearAllMocks()
    })

    it("should return payment when it exists", async () => {
        const payment = { id: 1, orderId: 10 }
        ;(prisma.payment.findUnique as any).mockResolvedValue(payment)
        const result = await repository.execute(10)
        expect(prisma.payment.findUnique).toHaveBeenCalledWith({
            where: { orderId: 10 },
        })
        expect(result).toEqual(payment)
    })

    it("should return null when payment is not found", async () => {
        ;(prisma.payment.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute(10)
        expect(result).toBeNull()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
