import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderItemByIdRepository } from "./find-order-item-by-id-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        orderItem: {
            findUnique: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe.skip("PrismaFindOrderItemByIdRepository", () => {
    let repository: PrismaFindOrderItemByIdRepository

    beforeEach(() => {
        repository = new PrismaFindOrderItemByIdRepository()
        vi.clearAllMocks()
    })

    it("should return the order item by id", async () => {
        const fakeOrderItem = {
            id: 123,
            orderId: 1,
            productId: 2,
            quantity: 3,
            unitPrice: 10,
            productName: "Test",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        ;(prisma.orderItem.findUnique as any).mockResolvedValue(fakeOrderItem)
        const result = await repository.execute(123)
        expect(prisma.orderItem.findUnique).toHaveBeenCalledWith({
            where: { id: 123 },
        })
        expect(result).toEqual(fakeOrderItem)
    })

    it("should return null if not found", async () => {
        ;(prisma.orderItem.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute(456)
        expect(prisma.orderItem.findUnique).toHaveBeenCalledWith({
            where: { id: 456 },
        })
        expect(result).toBeNull()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
