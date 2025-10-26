import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaDeleteProductOutputPort } from "./delete-product-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        product: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const fakeProduct = {
    id: 1,
    name: "Test",
    description: "Desc",
    price: 10,
    categoryId: 1,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe.skip("PrismaDeleteProductOutputPort", () => {
    let repository: PrismaDeleteProductOutputPort

    beforeEach(() => {
        repository = new PrismaDeleteProductOutputPort()
        vi.clearAllMocks()
    })

    it("should delete and return the product if found", async () => {
        ;(prisma.product.findUnique as any)
            .mockResolvedValue(fakeProduct)(prisma.product.delete as any)
            .mockResolvedValue(undefined)
        const result = await repository.execute({ id: 1 })
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } })
        expect(result).toEqual(fakeProduct)
    })

    it("should return null if product not found", async () => {
        ;(prisma.product.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: 99 })
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 99 },
        })
        expect(prisma.product.delete).not.toHaveBeenCalled()
        expect(result).toBeNull()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
