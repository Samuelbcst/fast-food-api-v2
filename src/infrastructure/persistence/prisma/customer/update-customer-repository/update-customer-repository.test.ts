import { prisma } from "@libraries/prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PrismaUpdateCustomerRepository } from "./update-customer-repository"

// Mock prisma client used in repository
vi.mock("@libraries/prisma/client", () => ({
    prisma: {
        customer: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}))

const mockCustomer = {
    id: 1,
    name: "customer",
    email: "customer@email.com",
    cpf: "12345678900",
    updatedAt: new Date(),
}

describe.skip("PrismaUpdateCustomerRepository", () => {
    let repository: PrismaUpdateCustomerRepository
    let now: Date

    beforeEach(() => {
        now = new Date()
        repository = new PrismaUpdateCustomerRepository()
        vi.clearAllMocks()
    })

    it("should return null if customer not found", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(null)
        const result = await repository.execute({
            id: 1,
            name: "new",
            email: "new@email.com",
            cpf: "999",
        })
        expect(result).toBeNull()
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.customer.update).not.toHaveBeenCalled()
    })

    it("should update name, email, and cpf if provided", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(mockCustomer)
        const updated = {
            ...mockCustomer,
            name: "new",
            email: "new@email.com",
            cpf: "999",
            updatedAt: now,
        }
        ;(prisma.customer.update as any).mockResolvedValue(updated)
        const result = await repository.execute({
            id: 1,
            name: "new",
            email: "new@email.com",
            cpf: "999",
        })
        expect(result).toEqual(updated)
        expect(prisma.customer.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                name: "new",
                email: "new@email.com",
                cpf: "999",
                updatedAt: expect.any(Date),
            },
        })
    })

    it("should only update name if email and cpf are not provided", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(mockCustomer)
        const updated = { ...mockCustomer, name: "new", updatedAt: now }
        ;(prisma.customer.update as any).mockResolvedValue(updated)
        const result = await repository.execute({ id: 1, name: "new" })
        expect(result).toEqual(updated)
        expect(prisma.customer.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { name: "new", updatedAt: expect.any(Date) },
        })
    })

    it("should only update email if name and cpf are not provided", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(mockCustomer)
        const updated = {
            ...mockCustomer,
            email: "new@email.com",
            updatedAt: now,
        }
        ;(prisma.customer.update as any).mockResolvedValue(updated)
        const result = await repository.execute({
            id: 1,
            email: "new@email.com",
        })
        expect(result).toEqual(updated)
        expect(prisma.customer.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { email: "new@email.com", updatedAt: expect.any(Date) },
        })
    })

    it("should only update cpf if name and email are not provided", async () => {
        ;(prisma.customer.findUnique as any).mockResolvedValue(mockCustomer)
        const updated = { ...mockCustomer, cpf: "999", updatedAt: now }
        ;(prisma.customer.update as any).mockResolvedValue(updated)
        const result = await repository.execute({ id: 1, cpf: "999" })
        expect(result).toEqual(updated)
        expect(prisma.customer.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { cpf: "999", updatedAt: expect.any(Date) },
        })
    })

    it("should disconnect on finish", async () => {
        await repository.finish()
        expect(prisma.$disconnect).toHaveBeenCalled()
    })
})
