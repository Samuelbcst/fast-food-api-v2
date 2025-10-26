import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderByIdRepository } from "./find-order-by-id-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findUnique: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe.skip("PrismaFindOrderByIdRepository", () => {
    let repository: PrismaFindOrderByIdRepository

    beforeEach(() => {
        repository = new PrismaFindOrderByIdRepository()
        vi.clearAllMocks()
    })

    it("should return the order with items if found", async () => {
        const mockOrder = {
            id: 1,
            customerId: 1,
            status: "RECEIVED",
            totalAmount: 100,
            statusUpdatedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            pickupCode: undefined,
            items: [],
        }
        ;(prisma.order.findUnique as any).mockResolvedValue(mockOrder)
        const result = await repository.execute(1)
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { items: true },
        })
        expect(result).toEqual(mockOrder)
    })

    it("should return null if not found", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute(2)
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
            include: { items: true },
        })
        expect(result).toBeNull()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
