import * as repoModule from "@persistence/prisma/payment/create-payment-repository/make-create-payment-repository"
import * as useCaseModule from "@use-cases/payment/create-payment/make-create-payment-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeCreatePaymentFactory } from "./make-payment-create-dependencies"

vi.mock(
    "@use-cases/payment/create-payment/make-create-payment-use-case",
    () => ({
        makeCreatePaymentUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/payment/create-payment-repository/make-create-payment-repository",
    () => ({
        makeCreatePaymentRepository: vi.fn(),
    })
)

export {}

describe("makeCreatePaymentFactory", () => {
    const mockRepository = { create: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeCreatePaymentRepository: ReturnType<typeof vi.fn>
    let mockedMakeCreatePaymentUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeCreatePaymentRepository = vi.mocked(
            repoModule.makeCreatePaymentRepository
        )
        mockedMakeCreatePaymentUseCase = vi.mocked(
            useCaseModule.makeCreatePaymentUseCase
        )
        if (mockedMakeCreatePaymentRepository.mock)
            mockedMakeCreatePaymentRepository.mockReset()
        if (mockedMakeCreatePaymentUseCase.mock)
            mockedMakeCreatePaymentUseCase.mockReset()
        if (mockedMakeCreatePaymentRepository.mock)
            mockedMakeCreatePaymentRepository.mockResolvedValue(mockRepository)
        if (mockedMakeCreatePaymentUseCase.mock)
            mockedMakeCreatePaymentUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeCreatePaymentFactory()
        expect(repoModule.makeCreatePaymentRepository).toHaveBeenCalled()
        expect(useCaseModule.makeCreatePaymentUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeCreatePaymentRepository.mock)
            mockedMakeCreatePaymentRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeCreatePaymentFactory()).rejects.toThrow("repo fail")
    })
})

export {}
