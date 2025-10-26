import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaUpdateOrderItemRepository } from "./update-order-item-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        orderItem: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe.skip("PrismaUpdateOrderItemRepository", () => {
    let repository: PrismaUpdateOrderItemRepository
    let now: Date

    beforeEach(() => {
        repository = new PrismaUpdateOrderItemRepository()
        now = new Date()
        vi.clearAllMocks()
    })

    it("should update and return the order item if found", async () => {
        const orderItem = {
            id: 1,
            quantity: 2,
            unitPrice: 10,
            orderId: 1,
            productId: 1,
            updatedAt: now,
            productName: "Test",
            createdAt: now,
        }
        ;(prisma.orderItem.findUnique as any).mockResolvedValue(orderItem)
        const updated = {
            ...orderItem,
            quantity: 5,
            unitPrice: 20,
            orderId: 2,
            productId: 3,
            updatedAt: now,
        }
        ;(prisma.orderItem.update as any).mockResolvedValue(updated)
        const result = await repository.execute({
            id: 1,
            quantity: 5,
            price: 20,
            orderId: 2,
            productId: 3,
        })
        expect(prisma.orderItem.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                quantity: 5,
                unitPrice: 20,
                orderId: 2,
                productId: 3,
                updatedAt: expect.any(Date),
            }),
        })
        expect(result).toEqual(updated)
    })

    it("should return null if order item not found", async () => {
        ;(prisma.orderItem.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 99 })
        expect(result).toBeNull()
        expect(prisma.orderItem.update).not.toHaveBeenCalled()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
