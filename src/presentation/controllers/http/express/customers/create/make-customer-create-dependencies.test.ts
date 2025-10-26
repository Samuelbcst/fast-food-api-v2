import { makeCreateCustomerRepository } from "@persistence/prisma/customer/create-customer-repository/make-create-customer-repository"
import { makeCreateCustomerUseCase } from "@application/use-cases/customer/create-customer/make-create-customer-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeCreateCustomerFactory } from "./make-customer-create-dependencies"

vi.mock(
    "@persistence/prisma/customer/create-customer-repository/make-create-customer-repository",
    () => ({
        makeCreateCustomerRepository: vi.fn(),
    })
)
vi.mock(
    "@application/use-cases/customer/create-customer/make-create-customer-use-case",
    () => ({
        makeCreateCustomerUseCase: vi.fn(),
    })
)

describe("makeCreateCustomerFactory", () => {
    const mockRepository = { repo: true }
    const mockUseCase = { use: true }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(makeCreateCustomerRepository).mockResolvedValue(
            mockRepository as any
        )
        vi.mocked(makeCreateCustomerUseCase).mockReturnValue(mockUseCase as any)
    })

    it("should create use case with repository", async () => {
        const result = await makeCreateCustomerFactory()
        expect(makeCreateCustomerRepository).toHaveBeenCalled()
        expect(makeCreateCustomerUseCase).toHaveBeenCalledWith(mockRepository)
        expect(result).toBe(mockUseCase)
    })
})
