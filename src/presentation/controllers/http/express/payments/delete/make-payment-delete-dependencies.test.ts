import * as repoModule from "@persistence/prisma/payment/delete-payment-repository/make-delete-payment-repository"
import * as useCaseModule from "@application/use-cases/payment/delete-payment/make-delete-payment-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeDeletePaymentFactory } from "./make-payment-delete-dependencies"

vi.mock(
    "@application/use-cases/payment/delete-payment/make-delete-payment-use-case",
    () => ({
        makeDeletePaymentUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/payment/delete-payment-repository/make-delete-payment-repository",
    () => ({
        makeDeletePaymentOutputPort: vi.fn(),
    })
)

export {}

describe("makeDeletePaymentFactory", () => {
    const mockRepository = { delete: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeDeletePaymentRepository: ReturnType<typeof vi.fn>
    let mockedMakeDeletePaymentUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeDeletePaymentRepository = vi.mocked(
            repoModule.makeDeletePaymentOutputPort
        )
        mockedMakeDeletePaymentUseCase = vi.mocked(
            useCaseModule.makeDeletePaymentUseCase
        )
        if (mockedMakeDeletePaymentRepository.mock)
            mockedMakeDeletePaymentRepository.mockReset()
        if (mockedMakeDeletePaymentUseCase.mock)
            mockedMakeDeletePaymentUseCase.mockReset()
        if (mockedMakeDeletePaymentRepository.mock)
            mockedMakeDeletePaymentRepository.mockResolvedValue(mockRepository)
        if (mockedMakeDeletePaymentUseCase.mock)
            mockedMakeDeletePaymentUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeDeletePaymentFactory()
        expect(repoModule.makeDeletePaymentOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeDeletePaymentUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeDeletePaymentRepository.mock)
            mockedMakeDeletePaymentRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeDeletePaymentFactory()).rejects.toThrow("repo fail")
    })
})

export {}
