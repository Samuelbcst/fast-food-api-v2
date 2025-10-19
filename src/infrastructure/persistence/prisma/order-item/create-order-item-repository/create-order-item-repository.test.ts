import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreateOrderItemRepository } from "./create-order-item-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        orderItem: {
            create: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockOrderItem = {
    orderId: 1,
    productId: 2,
    quantity: 3,
    unitPrice: 10,
    productName: "Test",
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("PrismaCreateOrderItemRepository", () => {
    let repository: PrismaCreateOrderItemRepository

    beforeEach(() => {
        repository = new PrismaCreateOrderItemRepository()
        vi.clearAllMocks()
    })

    it("should create and return an order item", async () => {
        ;(prisma.orderItem.create as any).mockResolvedValue(mockOrderItem)
        const result = await repository.create(mockOrderItem)
        expect(prisma.orderItem.create).toHaveBeenCalledWith({
            data: mockOrderItem,
        })
        expect(result).toEqual(mockOrderItem)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
