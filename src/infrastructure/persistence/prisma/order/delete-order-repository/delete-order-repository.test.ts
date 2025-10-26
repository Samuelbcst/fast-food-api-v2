import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaDeleteOrderRepository } from "./delete-order-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockOrder = {
    id: 1,
    customerId: 1,
    status: "RECEIVED",
    totalAmount: 100,
    statusUpdatedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    pickupCode: undefined,
}

describe.skip("PrismaDeleteOrderRepository", () => {
    let repository: PrismaDeleteOrderRepository

    beforeEach(() => {
        repository = new PrismaDeleteOrderRepository()
        vi.clearAllMocks()
    })

    it("should return null if order not found", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 1 })
        expect(result).toBeNull()
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should delete and return the order if found", async () => {
        ;(prisma.order.findUnique as any)
            .mockResolvedValue(mockOrder)(prisma.order.delete as any)
            .mockResolvedValue(undefined)
        const result = await repository.execute({ id: 1 })
        expect(result).toEqual({ ...mockOrder, items: [] })
        expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
