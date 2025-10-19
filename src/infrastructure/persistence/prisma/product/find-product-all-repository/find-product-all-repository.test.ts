import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindProductAllRepository } from "./find-product-all-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindProductAllRepository", () => {
    let repository: PrismaFindProductAllRepository

    beforeEach(() => {
        repository = new PrismaFindProductAllRepository()
        vi.clearAllMocks()
    })

    it("should return all products", async () => {
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
                categoryId: 2,
                active: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        ;(prisma.product.findMany as any).mockResolvedValue(fakeProducts)
        const result = await repository.execute()
        expect(prisma.product.findMany).toHaveBeenCalled()
        expect(result).toEqual(fakeProducts)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
