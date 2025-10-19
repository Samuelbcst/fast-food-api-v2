import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaFindCustomerByCpfRepository } from "./find-customer-by-cpf-repository"

// Mock prisma client used in repository
vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        customer: {
            findFirst: vi.fn(),
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

describe("PrismaFindCustomerByCpfRepository", () => {
    let repository: PrismaFindCustomerByCpfRepository

    beforeEach(() => {
        repository = new PrismaFindCustomerByCpfRepository()
        vi.clearAllMocks()
    })

    it("should return the customer if found", async () => {
        ;(prisma.customer.findFirst as any).mockResolvedValue(mockCustomer)
        const result = await repository.execute("12345678900")
        expect(result).toEqual(mockCustomer)
        expect(prisma.customer.findFirst).toHaveBeenCalledWith({
            where: { cpf: "12345678900" },
        })
    })

    it("should return null if not found", async () => {
        ;(prisma.customer.findFirst as any).mockResolvedValue(null)
        const result = await repository.execute("notfound")
        expect(result).toBeNull()
        expect(prisma.customer.findFirst).toHaveBeenCalledWith({
            where: { cpf: "notfound" },
        })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})

export {}
