import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindProductByCategoryOutputPort } from "./find-product-by-category-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindProductByCategoryOutputPort", () => {
    let repository: PrismaFindProductByCategoryOutputPort

    beforeEach(() => {
        repository = new PrismaFindProductByCategoryOutputPort()
        vi.clearAllMocks()
    })

    it("should return products by category", async () => {
        const fakeProducts = [
            {
                id: 1,
                name: "A",
                description: "desc",
                price: 10,
                categoryId: 1,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: "B",
                description: "desc2",
                price: 20,
                categoryId: 1,
                active: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        ;(prisma.product.findMany as any).mockResolvedValue(fakeProducts)
        const result = await repository.execute(1)
        expect(prisma.product.findMany).toHaveBeenCalledWith({
            where: { categoryId: 1 },
        })
        expect(result).toEqual(fakeProducts)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
