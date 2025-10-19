import * as repoModule from "@persistence/prisma/customer/find-customer-by-id-repository/make-find-customer-by-id-repository"
import * as useCaseModule from "@use-cases/customer/find-customer-by-id/make-find-customer-by-id-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeGetCustomerByIdFactory } from "./make-customer-get-by-id-dependencies"

vi.mock(
    "@use-cases/customer/find-customer-by-id/make-find-customer-by-id-use-case",
    () => ({
        makeFindCustomerByIdUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/customer/find-customer-by-id-repository/make-find-customer-by-id-repository",
    () => ({
        makeFindCustomerByIdRepository: vi.fn(),
    })
)

export {}

describe("makeGetCustomerByIdFactory", () => {
    const mockRepository = { findById: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindCustomerByIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindCustomerByIdUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindCustomerByIdRepository = vi.mocked(
            repoModule.makeFindCustomerByIdRepository
        )
        mockedMakeFindCustomerByIdUseCase = vi.mocked(
            useCaseModule.makeFindCustomerByIdUseCase
        )
        if (mockedMakeFindCustomerByIdRepository.mock)
            mockedMakeFindCustomerByIdRepository.mockReset()
        if (mockedMakeFindCustomerByIdUseCase.mock)
            mockedMakeFindCustomerByIdUseCase.mockReset()
        if (mockedMakeFindCustomerByIdRepository.mock)
            mockedMakeFindCustomerByIdRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindCustomerByIdUseCase.mock)
            mockedMakeFindCustomerByIdUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetCustomerByIdFactory()
        expect(repoModule.makeFindCustomerByIdRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindCustomerByIdUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindCustomerByIdRepository.mock)
            mockedMakeFindCustomerByIdRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetCustomerByIdFactory()).rejects.toThrow("repo fail")
    })
})
