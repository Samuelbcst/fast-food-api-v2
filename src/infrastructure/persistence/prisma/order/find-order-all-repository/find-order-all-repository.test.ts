import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderAllRepository } from "./find-order-all-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindOrderAllRepository", () => {
    let repository: PrismaFindOrderAllRepository

    beforeEach(() => {
        repository = new PrismaFindOrderAllRepository()
        vi.clearAllMocks()
    })

    it("should return all orders with items relation", async () => {
        const mockOrders = [
            {
                id: 1,
                customerId: 1,
                status: "RECEIVED",
                totalAmount: 100,
                statusUpdatedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                pickupCode: undefined,
                items: [],
            },
            {
                id: 2,
                customerId: 2,
                status: "PAID",
                totalAmount: 200,
                statusUpdatedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                pickupCode: undefined,
                items: [],
            },
        ]
        ;(prisma.order.findMany as any).mockResolvedValue(mockOrders)
        const result = await repository.execute()
        expect(prisma.order.findMany).toHaveBeenCalledWith({
            include: { items: true },
        })
        expect(result).toEqual(mockOrders)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
