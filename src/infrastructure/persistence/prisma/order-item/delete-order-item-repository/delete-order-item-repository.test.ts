import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaDeleteOrderItemRepository } from "./delete-order-item-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        orderItem: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockOrderItem = {
    id: 1,
    orderId: 1,
    productId: 2,
    quantity: 3,
    unitPrice: 10,
    productName: "Test",
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("PrismaDeleteOrderItemRepository", () => {
    let repository: PrismaDeleteOrderItemRepository

    beforeEach(() => {
        repository = new PrismaDeleteOrderItemRepository()
        vi.clearAllMocks()
    })

    it("should return null if order item not found", async () => {
        ;(prisma.orderItem.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 1 })
        expect(result).toBeNull()
        expect(prisma.orderItem.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should delete and return the order item if found", async () => {
        ;(prisma.orderItem.findUnique as any)
            .mockResolvedValue(mockOrderItem)(prisma.orderItem.delete as any)
            .mockResolvedValue(undefined)
        const result = await repository.execute({ id: 1 })
        expect(result).toEqual(mockOrderItem)
        expect(prisma.orderItem.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
