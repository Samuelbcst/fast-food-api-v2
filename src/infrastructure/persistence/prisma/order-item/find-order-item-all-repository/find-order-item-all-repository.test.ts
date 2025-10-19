import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderItemAllRepository } from "./find-order-item-all-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        orderItem: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindOrderItemAllRepository", () => {
    let repository: PrismaFindOrderItemAllRepository

    beforeEach(() => {
        repository = new PrismaFindOrderItemAllRepository()
        vi.clearAllMocks()
    })

    it("should return all order items", async () => {
        const mockOrderItems = [
            {
                id: 1,
                orderId: 1,
                productId: 2,
                quantity: 3,
                unitPrice: 10,
                productName: "Test",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                orderId: 1,
                productId: 3,
                quantity: 1,
                unitPrice: 20,
                productName: "Test2",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        ;(prisma.orderItem.findMany as any).mockResolvedValue(mockOrderItems)
        const result = await repository.execute()
        expect(prisma.orderItem.findMany).toHaveBeenCalled()
        expect(result).toEqual(mockOrderItems)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
