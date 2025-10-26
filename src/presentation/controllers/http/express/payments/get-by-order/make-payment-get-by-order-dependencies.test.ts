import * as repoModule from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import * as useCaseModule from "@application/use-cases/payment/find-payment-by-order-id/make-find-payment-by-order-id-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeGetPaymentByOrderFactory } from "./make-payment-get-by-order-dependencies"

vi.mock("@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository", () => ({
    makeFindPaymentByOrderIdOutputPort: vi.fn(),
}))

vi.mock("@application/use-cases/payment/find-payment-by-order-id/make-find-payment-by-order-id-use-case", () => ({
    makeFindPaymentByOrderIdUseCase: vi.fn(),
}))

describe("makeGetPaymentByOrderFactory", () => {
    const mockRepository = { execute: vi.fn(), finish: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedRepoFactory: ReturnType<typeof vi.fn>
    let mockedUseCaseFactory: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedRepoFactory = vi.mocked(
            repoModule.makeFindPaymentByOrderIdOutputPort
        )
        mockedUseCaseFactory = vi.mocked(
            useCaseModule.makeFindPaymentByOrderIdUseCase
        )
        mockedRepoFactory.mockReset()
        mockedUseCaseFactory.mockReset()
        mockedRepoFactory.mockResolvedValue(mockRepository)
        mockedUseCaseFactory.mockReturnValue(mockUseCase)
    })

    it("creates the use case with repository", async () => {
        const result = await makeGetPaymentByOrderFactory()
        expect(repoModule.makeFindPaymentByOrderIdOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeFindPaymentByOrderIdUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates repository errors", async () => {
        mockedRepoFactory.mockRejectedValue(new Error("repo error"))
        await expect(makeGetPaymentByOrderFactory()).rejects.toThrow(
            "repo error"
        )
    })
})
