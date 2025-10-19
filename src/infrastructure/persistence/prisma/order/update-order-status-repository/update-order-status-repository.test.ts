import { OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaUpdateOrderStatusRepository } from "./update-order-status-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        order: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockOrder = {
    id: 1,
    status: OrderStatus.RECEIVED,
    statusUpdatedAt: new Date(),
    updatedAt: new Date(),
    items: [],
}

describe("PrismaUpdateOrderStatusRepository", () => {
    let repository: PrismaUpdateOrderStatusRepository
    let now: Date

    beforeEach(() => {
        repository = new PrismaUpdateOrderStatusRepository()
        now = new Date()
        vi.clearAllMocks()
    })

    it("should return null if order not found", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({
            id: 1,
            status: OrderStatus.FINISHED,
        })
        expect(result).toBeNull()
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should update status and timestamps", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue({ ...mockOrder })
        const updatedOrder = {
            ...mockOrder,
            status: OrderStatus.FINISHED,
            statusUpdatedAt: now,
            updatedAt: now,
        }
        ;(prisma.order.update as any).mockResolvedValue(updatedOrder)
        const result = await repository.execute({
            id: 1,
            status: OrderStatus.FINISHED,
        })
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                status: OrderStatus.FINISHED,
                statusUpdatedAt: expect.any(Date),
                updatedAt: expect.any(Date),
            }),
            include: { items: true },
        })
        expect(result).toEqual({ ...updatedOrder, items: [] })
        if (result) {
            expect(result.statusUpdatedAt).toBeInstanceOf(Date)
            expect(result.updatedAt).toBeInstanceOf(Date)
        }
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
