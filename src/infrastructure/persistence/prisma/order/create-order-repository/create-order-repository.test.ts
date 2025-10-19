import { OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreateOrderRepository } from "./create-order-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            create: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockOrder = {
    customerId: 1,
    status: OrderStatus.RECEIVED,
    totalAmount: 100,
    statusUpdatedAt: new Date(),
    pickupCode: undefined,
    items: [],
}
const mockCreatedOrder = {
    id: 1,
    ...mockOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
}

describe("PrismaCreateOrderRepository", () => {
    let repository: PrismaCreateOrderRepository

    beforeEach(() => {
        repository = new PrismaCreateOrderRepository()
        vi.clearAllMocks()
    })

    it("should create and return an order", async () => {
        ;(prisma.order.create as any).mockResolvedValue({
            ...mockCreatedOrder,
            items: undefined,
        })
        const result = await repository.create(mockOrder)
        expect(prisma.order.create).toHaveBeenCalledWith({
            data: {
                customerId: mockOrder.customerId,
                status: mockOrder.status,
                totalAmount: mockOrder.totalAmount,
                statusUpdatedAt: mockOrder.statusUpdatedAt,
                pickupCode: mockOrder.pickupCode,
            },
        })
        expect(result).toEqual({ ...mockCreatedOrder, items: [] })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
