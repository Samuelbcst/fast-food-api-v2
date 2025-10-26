import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindProductByIdOutputPort } from "./find-product-by-id-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        product: {
            findUnique: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindProductByIdOutputPort", () => {
    let repository: PrismaFindProductByIdOutputPort

    beforeEach(() => {
        repository = new PrismaFindProductByIdOutputPort()
        vi.clearAllMocks()
    })

    it("should return the product if found", async () => {
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
        ;(prisma.product.findUnique as any).mockResolvedValue(fakeProduct)
        const result = await repository.execute(1)
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(result).toEqual(fakeProduct)
    })

    it("should return null if product not found", async () => {
        ;(prisma.product.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute(99)
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 99 },
        })
        expect(result).toBeNull()
    })
})
