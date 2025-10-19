import * as repoModule from "@persistence/prisma/payment/find-payment-by-id-repository/make-find-payment-by-id-repository"
import * as useCaseModule from "@use-cases/payment/find-payment-by-id/make-find-payment-by-id-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetPaymentByIdFactory } from "./make-payment-get-by-id-dependencies"

vi.mock(
    "@use-cases/payment/find-payment-by-id/make-find-payment-by-id-use-case",
    () => ({
        makeFindPaymentByIdUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/payment/find-payment-by-id-repository/make-find-payment-by-id-repository",
    () => ({
        makeFindPaymentByIdRepository: vi.fn(),
    })
)

export {}

describe("makeGetPaymentByIdFactory", () => {
    const mockRepository = { findById: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindPaymentByIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindPaymentByIdUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindPaymentByIdRepository = vi.mocked(
            repoModule.makeFindPaymentByIdRepository
        )
        mockedMakeFindPaymentByIdUseCase = vi.mocked(
            useCaseModule.makeFindPaymentByIdUseCase
        )
        if (mockedMakeFindPaymentByIdRepository.mock)
            mockedMakeFindPaymentByIdRepository.mockReset()
        if (mockedMakeFindPaymentByIdUseCase.mock)
            mockedMakeFindPaymentByIdUseCase.mockReset()
        if (mockedMakeFindPaymentByIdRepository.mock)
            mockedMakeFindPaymentByIdRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindPaymentByIdUseCase.mock)
            mockedMakeFindPaymentByIdUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetPaymentByIdFactory()
        expect(repoModule.makeFindPaymentByIdRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindPaymentByIdUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindPaymentByIdRepository.mock)
            mockedMakeFindPaymentByIdRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetPaymentByIdFactory()).rejects.toThrow("repo fail")
    })
})

export {}
