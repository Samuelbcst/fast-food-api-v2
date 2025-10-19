import * as repoModule from "@persistence/prisma/customer/delete-customer-repository/make-delete-customer-repository"
import * as useCaseModule from "@use-cases/customer/delete-customer/make-delete-customer-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeDeleteCustomerFactory } from "./make-customer-delete-dependencies"

vi.mock(
    "@use-cases/customer/delete-customer/make-delete-customer-use-case",
    () => ({
        makeDeleteCustomerUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/customer/delete-customer-repository/make-delete-customer-repository",
    () => ({
        makeDeleteCustomerRepository: vi.fn(),
    })
)

export {}

describe("makeDeleteCustomerFactory", () => {
    const mockRepository = { delete: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeDeleteCustomerRepository: ReturnType<typeof vi.fn>
    let mockedMakeDeleteCustomerUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeDeleteCustomerRepository = vi.mocked(
            repoModule.makeDeleteCustomerRepository
        )
        mockedMakeDeleteCustomerUseCase = vi.mocked(
            useCaseModule.makeDeleteCustomerUseCase
        )
        if (mockedMakeDeleteCustomerRepository.mock)
            mockedMakeDeleteCustomerRepository.mockReset()
        if (mockedMakeDeleteCustomerUseCase.mock)
            mockedMakeDeleteCustomerUseCase.mockReset()
        if (mockedMakeDeleteCustomerRepository.mock)
            mockedMakeDeleteCustomerRepository.mockResolvedValue(mockRepository)
        if (mockedMakeDeleteCustomerUseCase.mock)
            mockedMakeDeleteCustomerUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeDeleteCustomerFactory()
        expect(repoModule.makeDeleteCustomerRepository).toHaveBeenCalled()
        expect(useCaseModule.makeDeleteCustomerUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeDeleteCustomerRepository.mock)
            mockedMakeDeleteCustomerRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeDeleteCustomerFactory()).rejects.toThrow("repo fail")
    })
})
