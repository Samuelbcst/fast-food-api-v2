import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindCustomerAllRepository } from "./find-customer-all-repository"

// Mock prisma client used in repository
vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        customer: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

describe("PrismaFindCustomerAllRepository", () => {
    let repository: PrismaFindCustomerAllRepository

    beforeEach(() => {
        repository = new PrismaFindCustomerAllRepository()
        vi.clearAllMocks()
    })

    it("should return all customers", async () => {
        const mockCustomers = [
            { id: 1, name: "customer1", email: "a@a.com", cpf: "123" },
            { id: 2, name: "customer2", email: "b@b.com", cpf: "456" },
        ]
        ;(prisma.customer.findMany as any).mockResolvedValue(mockCustomers)
        const result = await repository.execute()
        expect(result).toEqual(mockCustomers)
        expect(prisma.customer.findMany).toHaveBeenCalled()
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
