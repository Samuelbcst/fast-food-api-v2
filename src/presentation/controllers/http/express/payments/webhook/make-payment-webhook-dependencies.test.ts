import * as findOrderRepoModule from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import * as findPaymentRepoModule from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import * as updatePaymentRepoModule from "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository"
import * as updateOrderStatusRepoModule from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import * as updateOrderStatusUseCaseModule from "@use-cases/order/update-order-status/make-update-order-status-use-case"
import * as processWebhookUseCaseModule from "@use-cases/payment/process-payment-webhook/make-process-payment-webhook-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makePaymentWebhookFactory } from "./make-payment-webhook-dependencies"

vi.mock("@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository", () => ({
    makeFindPaymentByOrderIdRepository: vi.fn(),
}))
vi.mock("@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository", () => ({
    makeFindOrderByIdRepository: vi.fn(),
}))
vi.mock("@persistence/prisma/payment/update-payment-repository/make-update-payment-repository", () => ({
    makeUpdatePaymentRepository: vi.fn(),
}))
vi.mock("@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository", () => ({
    makeUpdateOrderStatusRepository: vi.fn(),
}))
vi.mock("@use-cases/order/update-order-status/make-update-order-status-use-case", () => ({
    makeUpdateOrderStatusUseCase: vi.fn(),
}))
vi.mock("@use-cases/payment/process-payment-webhook/make-process-payment-webhook-use-case", () => ({
    makeProcessPaymentWebhookUseCase: vi.fn(),
}))

describe("makePaymentWebhookFactory", () => {
    const mockFinder = { execute: vi.fn(), finish: vi.fn() }
    const mockPaymentForOrderStatus = { execute: vi.fn(), finish: vi.fn() }
    const mockUpdater = { execute: vi.fn(), finish: vi.fn() }
    const mockOrderFinder = { execute: vi.fn(), finish: vi.fn() }
    const mockOrderStatusUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
    }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }

    beforeEach(() => {
        vi.mocked(findPaymentRepoModule.makeFindPaymentByOrderIdRepository)
            .mockReset()
            .mockResolvedValueOnce(mockFinder)
            .mockResolvedValueOnce(mockPaymentForOrderStatus)
        vi.mocked(findOrderRepoModule.makeFindOrderByIdRepository)
            .mockReset()
            .mockResolvedValue(mockOrderFinder)
        vi.mocked(updatePaymentRepoModule.makeUpdatePaymentRepository)
            .mockReset()
            .mockResolvedValue(mockUpdater)
        vi.mocked(updateOrderStatusRepoModule.makeUpdateOrderStatusRepository)
            .mockReset()
            .mockResolvedValue({})
        vi.mocked(updateOrderStatusUseCaseModule.makeUpdateOrderStatusUseCase)
            .mockReset()
            .mockReturnValue(mockOrderStatusUseCase)
        vi.mocked(processWebhookUseCaseModule.makeProcessPaymentWebhookUseCase)
            .mockReset()
            .mockReturnValue(mockUseCase)
    })

    it("composes dependencies and returns use case", async () => {
        const useCase = await makePaymentWebhookFactory()
        expect(
            findPaymentRepoModule.makeFindPaymentByOrderIdRepository
        ).toHaveBeenCalledTimes(2)
        expect(
            findOrderRepoModule.makeFindOrderByIdRepository
        ).toHaveBeenCalled()
        expect(updatePaymentRepoModule.makeUpdatePaymentRepository).toHaveBeenCalled()
        expect(updateOrderStatusRepoModule.makeUpdateOrderStatusRepository).toHaveBeenCalled()
        expect(updateOrderStatusUseCaseModule.makeUpdateOrderStatusUseCase).toHaveBeenCalled()
        expect(
            processWebhookUseCaseModule.makeProcessPaymentWebhookUseCase
        ).toHaveBeenCalledWith(mockFinder, mockUpdater, mockOrderStatusUseCase)
        expect(
            updateOrderStatusUseCaseModule.makeUpdateOrderStatusUseCase
        ).toHaveBeenCalledWith(
            expect.anything(),
            mockOrderFinder,
            mockPaymentForOrderStatus
        )
        expect(useCase).toBe(mockUseCase)
    })
})
