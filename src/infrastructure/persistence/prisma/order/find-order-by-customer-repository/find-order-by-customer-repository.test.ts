import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderByCustomerRepository } from "./find-order-by-customer-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindOrderByCustomerRepository", () => {
    let repository: PrismaFindOrderByCustomerRepository

    beforeEach(() => {
        repository = new PrismaFindOrderByCustomerRepository()
        vi.clearAllMocks()
    })

    it("should return all orders for a customer with items relation", async () => {
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
                customerId: 1,
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
        const result = await repository.execute(1)
        expect(prisma.order.findMany).toHaveBeenCalledWith({
            where: { customerId: 1 },
            include: { items: true },
        })
        expect(result).toEqual(mockOrders)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
