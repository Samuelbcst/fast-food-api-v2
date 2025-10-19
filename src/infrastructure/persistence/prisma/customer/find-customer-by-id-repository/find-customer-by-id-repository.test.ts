import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindCustomerByIdRepository } from "./find-customer-by-id-repository"

// Mock prisma client used in repository
vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        customer: {
            findUnique: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockCustomer = {
    id: 1,
    name: "customer",
    email: "customer@email.com",
    cpf: "12345678900",
}

describe("PrismaFindCustomerByIdRepository", () => {
    let repository: PrismaFindCustomerByIdRepository

    beforeEach(() => {
        repository = new PrismaFindCustomerByIdRepository()
        vi.clearAllMocks()
    })

    it("should return the customer if found", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(mockCustomer)
        const result = await repository.execute(1)
        expect(result).toEqual(mockCustomer)
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should return null if not found", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute(2)
        expect(result).toBeNull()
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
        })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})

export {}
