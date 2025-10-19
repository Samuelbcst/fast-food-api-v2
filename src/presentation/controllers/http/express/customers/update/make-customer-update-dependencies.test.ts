import * as repoModule from "@persistence/prisma/customer/update-customer-repository/make-update-customer-repository"
import * as useCaseModule from "@use-cases/customer/update-customer/make-update-customer-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeUpdateCustomerFactory } from "./make-customer-update-dependencies"

vi.mock(
    "@use-cases/customer/update-customer/make-update-customer-use-case",
    () => ({
        makeUpdateCustomerUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/customer/update-customer-repository/make-update-customer-repository",
    () => ({
        makeUpdateCustomerRepository: vi.fn(),
    })
)

export {}

describe("makeUpdateCustomerFactory", () => {
    const mockRepository = { update: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeUpdateCustomerRepository: ReturnType<typeof vi.fn>
    let mockedMakeUpdateCustomerUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeUpdateCustomerRepository = vi.mocked(
            repoModule.makeUpdateCustomerRepository
        )
        mockedMakeUpdateCustomerUseCase = vi.mocked(
            useCaseModule.makeUpdateCustomerUseCase
        )
        if (mockedMakeUpdateCustomerRepository.mock)
            mockedMakeUpdateCustomerRepository.mockReset()
        if (mockedMakeUpdateCustomerUseCase.mock)
            mockedMakeUpdateCustomerUseCase.mockReset()
        if (mockedMakeUpdateCustomerRepository.mock)
            mockedMakeUpdateCustomerRepository.mockResolvedValue(mockRepository)
        if (mockedMakeUpdateCustomerUseCase.mock)
            mockedMakeUpdateCustomerUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeUpdateCustomerFactory()
        expect(repoModule.makeUpdateCustomerRepository).toHaveBeenCalled()
        expect(useCaseModule.makeUpdateCustomerUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeUpdateCustomerRepository.mock)
            mockedMakeUpdateCustomerRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeUpdateCustomerFactory()).rejects.toThrow("repo fail")
    })
})
