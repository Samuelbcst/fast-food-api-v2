import { OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindOrderAllOutputPort } from "./find-order-all-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe.skip("PrismaFindOrderAllOutputPort", () => {
    let repository: PrismaFindOrderAllOutputPort

    beforeEach(() => {
        repository = new PrismaFindOrderAllOutputPort()
        vi.clearAllMocks()
    })

    it("filters finished orders and sorts by status priority and creation date", async () => {
        const mockOrders = [
            {
                id: 1,
                customerId: 1,
                status: OrderStatus.RECEIVED,
                totalAmount: 100,
                statusUpdatedAt: new Date(),
                createdAt: new Date("2024-01-02T00:00:00Z"),
                updatedAt: new Date(),
                pickupCode: undefined,
                items: [],
            },
            {
                id: 2,
                customerId: 2,
                status: OrderStatus.READY,
                totalAmount: 200,
                statusUpdatedAt: new Date(),
                createdAt: new Date("2024-01-01T00:00:00Z"),
                updatedAt: new Date(),
                pickupCode: undefined,
                items: [],
            },
            {
                id: 3,
                customerId: 3,
                status: OrderStatus.FINISHED,
                totalAmount: 200,
                statusUpdatedAt: new Date(),
                createdAt: new Date("2024-01-03T00:00:00Z"),
                updatedAt: new Date(),
                pickupCode: undefined,
                items: [],
            },
        ]
        ;(prisma.order.findMany as any).mockResolvedValue(mockOrders)
        const result = await repository.execute()
        expect(prisma.order.findMany).toHaveBeenCalledWith({
            where: {
                status: {
                    not: OrderStatus.FINISHED,
                },
            },
            include: { items: true },
        })
        expect(result.map((order) => order.id)).toEqual([2, 1])
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
