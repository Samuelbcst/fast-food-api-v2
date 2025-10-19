import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaUpdateProductRepository } from "./update-product-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        product: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaUpdateProductRepository", () => {
    let repository: PrismaUpdateProductRepository
    let now: Date

    beforeEach(() => {
        repository = new PrismaUpdateProductRepository()
        now = new Date()
        vi.clearAllMocks()
    })

    it("should update and return the product if found", async () => {
        const product = {
            id: 1,
            name: "A",
            description: "desc",
            price: 10,
            categoryId: 1,
            updatedAt: now,
            createdAt: now,
        }
        ;(prisma.product.findUnique as any).mockResolvedValue(product)
        const updated = { ...product, name: "B", price: 20, updatedAt: now }
        ;(prisma.product.update as any).mockResolvedValue(updated)
        const result = await repository.execute({ id: 1, name: "B", price: 20 })
        expect(prisma.product.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: expect.objectContaining({
                name: "B",
                price: 20,
                updatedAt: expect.any(Date),
            }),
        })
        expect(result).toEqual(updated)
    })

    it("should return null if product not found", async () => {
        ;(prisma.product.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 99 })
        expect(result).toBeNull()
        expect(prisma.product.update).not.toHaveBeenCalled()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
