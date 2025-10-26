import { OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaUpdateOrderRepository } from "./update-order-repository"

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
    customerId: 1,
    items: [],
    status: OrderStatus.RECEIVED,
    statusUpdatedAt: new Date(),
    totalAmount: 100,
    pickupCode: "ABC",
    updatedAt: new Date(),
    createdAt: new Date(),
}

describe.skip("PrismaUpdateOrderRepository", () => {
    let repository: PrismaUpdateOrderRepository
    let now: Date

    beforeEach(() => {
        repository = new PrismaUpdateOrderRepository()
        now = new Date()
        vi.clearAllMocks()
    })

    it("should return null if order not found", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 1, customerId: 2 })
        expect(result).toBeNull()
        expect(prisma.order.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { items: true },
        })
    })

    it("should update all fields if provided, including items", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue({ ...mockOrder })
        const items = [
            {
                id: 10,
                orderId: 1,
                productId: 1,
                productName: "item1",
                unitPrice: 5,
                quantity: 1,
                total: 5,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: 11,
                orderId: 1,
                productId: 2,
                productName: "item2",
                unitPrice: 10,
                quantity: 2,
                total: 20,
                createdAt: now,
                updatedAt: now,
            },
        ]
        const updatedOrder = {
            ...mockOrder,
            customerId: 2,
            status: OrderStatus.PREPARING,
            statusUpdatedAt: now,
            totalAmount: 200,
            pickupCode: "XYZ",
            items,
        }
        ;(prisma.order.update as any).mockResolvedValue(updatedOrder)
        const result = await repository.execute({
            id: 1,
            customerId: 2,
            items,
            status: OrderStatus.PREPARING,
            statusUpdatedAt: now,
            totalAmount: 200,
            pickupCode: "XYZ",
        })
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                customerId: 2,
                status: OrderStatus.PREPARING,
                statusUpdatedAt: now,
                totalAmount: 200,
                pickupCode: "XYZ",
                updatedAt: expect.any(Date),
                items: { set: [], create: items },
            }),
            include: { items: true },
        })
        expect(result).toEqual({ ...updatedOrder, items })
    })

    it("should only update provided fields (no items)", async () => {
        ;(prisma.order.findUnique as any).mockResolvedValue({ ...mockOrder })
        const updatedOrder = { ...mockOrder, status: OrderStatus.FINISHED }
        ;(prisma.order.update as any).mockResolvedValue(updatedOrder)
        const result = await repository.execute({
            id: 1,
            status: OrderStatus.FINISHED,
        })
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                status: OrderStatus.FINISHED,
                updatedAt: expect.any(Date),
            }),
            include: { items: true },
        })
        expect(result).toEqual({ ...updatedOrder, items: [] })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
