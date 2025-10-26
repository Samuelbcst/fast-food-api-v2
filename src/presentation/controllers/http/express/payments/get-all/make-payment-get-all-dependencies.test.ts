import * as repoModule from "@persistence/prisma/payment/find-payment-all-repository/make-find-payment-all-repository"
import * as useCaseModule from "@application/use-cases/payment/find-payment-all/make-find-payment-all-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetPaymentAllFactory } from "./make-payment-get-all-dependencies"

vi.mock(
    "@application/use-cases/payment/find-payment-all/make-find-payment-all-use-case",
    () => ({
        makeFindPaymentAllUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/payment/find-payment-all-repository/make-find-payment-all-repository",
    () => ({
        makeFindPaymentAllOutputPort: vi.fn(),
    })
)

export {}

describe("makeGetPaymentAllFactory", () => {
    const mockRepository = { findAll: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindPaymentAllRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindPaymentAllUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindPaymentAllRepository = vi.mocked(
            repoModule.makeFindPaymentAllOutputPort
        )
        mockedMakeFindPaymentAllUseCase = vi.mocked(
            useCaseModule.makeFindPaymentAllUseCase
        )
        if (mockedMakeFindPaymentAllRepository.mock)
            mockedMakeFindPaymentAllRepository.mockReset()
        if (mockedMakeFindPaymentAllUseCase.mock)
            mockedMakeFindPaymentAllUseCase.mockReset()
        if (mockedMakeFindPaymentAllRepository.mock)
            mockedMakeFindPaymentAllRepository.mockResolvedValue(mockRepository)
        if (mockedMakeFindPaymentAllUseCase.mock)
            mockedMakeFindPaymentAllUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetPaymentAllFactory()
        expect(repoModule.makeFindPaymentAllOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeFindPaymentAllUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindPaymentAllRepository.mock)
            mockedMakeFindPaymentAllRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetPaymentAllFactory()).rejects.toThrow("repo fail")
    })
})

export {}
