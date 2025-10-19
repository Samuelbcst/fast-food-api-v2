import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaDeleteCustomerRepository } from "./delete-customer-repository"

// Mock prisma client used in repository
vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        customer: {
            findUnique: vi.fn(),
            delete: vi.fn(),
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

describe("PrismaDeleteCustomerRepository", () => {
    let repository: PrismaDeleteCustomerRepository

    beforeEach(() => {
        repository = new PrismaDeleteCustomerRepository()
        // Clear mocks before each test
        vi.clearAllMocks()
    })

    it("should return null if customer not found", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({ id: mockCustomer.id })
        expect(result).toBeNull()
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { id: mockCustomer.id },
        })
        expect(prisma.customer.delete).not.toHaveBeenCalled()
    })

    it("should delete and return the customer if found", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(mockCustomer)
        ;(prisma.customer.delete as any).mockResolvedValue(undefined)
        const result = await repository.execute({ id: mockCustomer.id })
        expect(result).toEqual(mockCustomer)
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { id: mockCustomer.id },
        })
        expect(prisma.customer.delete).toHaveBeenCalledWith({
            where: { id: mockCustomer.id },
        })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
