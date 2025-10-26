import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreateProductOutputPort } from "./create-product-repository"

vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        product: {
            create: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const productData = {
    name: "Test",
    description: "Desc",
    price: 10,
    categoryId: 1,
    active: true,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("PrismaCreateProductOutputPort", () => {
    let repository: PrismaCreateProductOutputPort

    beforeEach(() => {
        repository = new PrismaCreateProductOutputPort()
        vi.clearAllMocks()
    })

    it("should create and return a product", async () => {
        ;(prisma.product.create as any).mockResolvedValue(productData)
        const result = await repository.create(productData)
        expect(prisma.product.create).toHaveBeenCalledWith({
            data: productData,
        })
        expect(result).toEqual(productData)
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
