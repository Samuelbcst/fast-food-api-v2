import { OrderStatus } from "@entities/order/order"
import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreateOrderOutputPort } from "./create-order-repository"

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
    items: [
        {
            productId: 1,
            productName: "Burger",
            unitPrice: 10,
            quantity: 2,
        },
    ],
}
const mockCreatedOrder = {
    id: 1,
    ...mockOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
}

describe("PrismaCreateOrderOutputPort", () => {
    let repository: PrismaCreateOrderOutputPort

    beforeEach(() => {
        repository = new PrismaCreateOrderOutputPort()
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
                items: {
                    create: mockOrder.items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: true },
        })
        expect(result).toEqual({ ...mockCreatedOrder, items: [] })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
