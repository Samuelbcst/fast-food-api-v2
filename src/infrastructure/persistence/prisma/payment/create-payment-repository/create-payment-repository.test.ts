import { PaymentStatus } from "@entities/payment/payment"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreatePaymentOutputPort } from "./create-payment-repository"

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
    paymentStatus: PaymentStatus.PENDING,
    paidAt: null,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("PrismaCreatePaymentOutputPort", () => {
    let repository: PrismaCreatePaymentOutputPort

    beforeEach(() => {
        repository = new PrismaCreatePaymentOutputPort()
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
