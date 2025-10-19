import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderByStatusRepository } from "./find-order-by-status-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindOrderByStatusRepository", () => {
    let repository: PrismaFindOrderByStatusRepository

    beforeEach(() => {
        repository = new PrismaFindOrderByStatusRepository()
        vi.clearAllMocks()
    })

    it("should return all orders with the given status and items relation", async () => {
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
                status: "RECEIVED",
                totalAmount: 200,
                statusUpdatedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                pickupCode: undefined,
                items: [],
            },
        ]
        ;(prisma.order.findMany as any).mockResolvedValue(mockOrders)
        const result = await repository.execute("RECEIVED")
        expect(prisma.order.findMany).toHaveBeenCalledWith({
            where: { status: "RECEIVED" },
            include: { items: true },
        })
        expect(result).toEqual(mockOrders)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
