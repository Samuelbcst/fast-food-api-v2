import * as repoModule from "@persistence/prisma/customer/find-customer-by-cpf-repository/make-find-customer-by-cpf-repository"
import * as useCaseModule from "@use-cases/customer/find-customer-by-cpf"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeGetCustomerByCpfFactory } from "./make-customer-get-by-cpf-dependencies"

vi.mock("@use-cases/customer/find-customer-by-cpf", () => ({
    FindCustomerByCpfUseCase: vi.fn(),
}))
vi.mock(
    "@persistence/prisma/customer/find-customer-by-cpf-repository/make-find-customer-by-cpf-repository",
    () => ({
        makeFindCustomerByCpfRepository: vi.fn(),
    })
)

export {}

describe("makeGetCustomerByCpfFactory", () => {
    const mockRepository = { findByCpf: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindCustomerByCpfRepository: ReturnType<typeof vi.fn>
    let mockedFindCustomerByCpfUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindCustomerByCpfRepository = vi.mocked(
            repoModule.makeFindCustomerByCpfRepository
        )
        mockedFindCustomerByCpfUseCase = vi.mocked(
            useCaseModule.FindCustomerByCpfUseCase
        )
        if (mockedMakeFindCustomerByCpfRepository.mock)
            mockedMakeFindCustomerByCpfRepository.mockReset()
        if (mockedFindCustomerByCpfUseCase.mock)
            mockedFindCustomerByCpfUseCase.mockReset()
        if (mockedMakeFindCustomerByCpfRepository.mock)
            mockedMakeFindCustomerByCpfRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedFindCustomerByCpfUseCase.mock)
            mockedFindCustomerByCpfUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetCustomerByCpfFactory()
        expect(repoModule.makeFindCustomerByCpfRepository).toHaveBeenCalled()
        expect(useCaseModule.FindCustomerByCpfUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindCustomerByCpfRepository.mock)
            mockedMakeFindCustomerByCpfRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetCustomerByCpfFactory()).rejects.toThrow("repo fail")
    })
})
