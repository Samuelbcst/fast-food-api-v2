import * as repoModule from "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository"
import * as useCaseModule from "@use-cases/payment/update-payment/make-update-payment-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeUpdatePaymentFactory } from "./make-payment-update-dependencies"

vi.mock(
    "@use-cases/payment/update-payment/make-update-payment-use-case",
    () => ({
        makeUpdatePaymentUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository",
    () => ({
        makeUpdatePaymentRepository: vi.fn(),
    })
)

export {}

describe("makeUpdatePaymentFactory", () => {
    const mockRepository = { update: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeUpdatePaymentRepository: ReturnType<typeof vi.fn>
    let mockedMakeUpdatePaymentUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeUpdatePaymentRepository = vi.mocked(
            repoModule.makeUpdatePaymentRepository
        )
        mockedMakeUpdatePaymentUseCase = vi.mocked(
            useCaseModule.makeUpdatePaymentUseCase
        )
        if (mockedMakeUpdatePaymentRepository.mock)
            mockedMakeUpdatePaymentRepository.mockReset()
        if (mockedMakeUpdatePaymentUseCase.mock)
            mockedMakeUpdatePaymentUseCase.mockReset()
        if (mockedMakeUpdatePaymentRepository.mock)
            mockedMakeUpdatePaymentRepository.mockResolvedValue(mockRepository)
        if (mockedMakeUpdatePaymentUseCase.mock)
            mockedMakeUpdatePaymentUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeUpdatePaymentFactory()
        expect(repoModule.makeUpdatePaymentRepository).toHaveBeenCalled()
        expect(useCaseModule.makeUpdatePaymentUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeUpdatePaymentRepository.mock)
            mockedMakeUpdatePaymentRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeUpdatePaymentFactory()).rejects.toThrow("repo fail")
    })
})

export {}
