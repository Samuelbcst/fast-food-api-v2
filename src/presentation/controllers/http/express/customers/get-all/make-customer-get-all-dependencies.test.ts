import * as repoModule from "@persistence/prisma/customer/find-customer-all-repository/make-find-customer-all-repository"
import * as useCaseModule from "@use-cases/customer/find-customer-all/make-find-customer-all-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeGetCustomerAllFactory } from "./make-customer-get-all-dependencies"

vi.mock(
    "@use-cases/customer/find-customer-all/make-find-customer-all-use-case",
    () => ({
        makeFindCustomerAllUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/customer/find-customer-all-repository/make-find-customer-all-repository",
    () => ({
        makeFindCustomerAllRepository: vi.fn(),
    })
)

export {}

describe("makeGetCustomerAllFactory", () => {
    const mockRepository = { findAll: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindCustomerAllRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindCustomerAllUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindCustomerAllRepository = vi.mocked(
            repoModule.makeFindCustomerAllRepository
        )
        mockedMakeFindCustomerAllUseCase = vi.mocked(
            useCaseModule.makeFindCustomerAllUseCase
        )
        if (mockedMakeFindCustomerAllRepository.mock)
            mockedMakeFindCustomerAllRepository.mockReset()
        if (mockedMakeFindCustomerAllUseCase.mock)
            mockedMakeFindCustomerAllUseCase.mockReset()
        if (mockedMakeFindCustomerAllRepository.mock)
            mockedMakeFindCustomerAllRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindCustomerAllUseCase.mock)
            mockedMakeFindCustomerAllUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetCustomerAllFactory()
        expect(repoModule.makeFindCustomerAllRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindCustomerAllUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindCustomerAllRepository.mock)
            mockedMakeFindCustomerAllRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetCustomerAllFactory()).rejects.toThrow("repo fail")
    })
})
