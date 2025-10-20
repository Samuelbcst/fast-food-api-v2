import * as findOrderRepoModule from "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository"
import * as findPaymentRepoModule from "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository"
import * as repoModule from "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository"
import * as useCaseModule from "@use-cases/order/update-order-status/make-update-order-status-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeUpdateOrderStatusFactory } from "./make-order-update-status-dependencies"

vi.mock(
    "@use-cases/order/update-order-status/make-update-order-status-use-case",
    () => ({
        makeUpdateOrderStatusUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/order/find-order-by-id-repository/make-find-order-by-id-repository",
    () => ({
        makeFindOrderByIdRepository: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository",
    () => ({
        makeUpdateOrderStatusRepository: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/payment/find-payment-by-order-id-repository/make-find-payment-by-order-id-repository",
    () => ({
        makeFindPaymentByOrderIdRepository: vi.fn(),
    })
)

export {}

describe("makeUpdateOrderStatusFactory", () => {
    const mockRepository = { updateStatus: vi.fn() }
    const mockFindOrderRepository = { execute: vi.fn(), finish: vi.fn() }
    const mockFindPaymentRepository = { execute: vi.fn(), finish: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeUpdateOrderStatusRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindOrderByIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindPaymentByOrderIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeUpdateOrderStatusUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeUpdateOrderStatusRepository = vi.mocked(
            repoModule.makeUpdateOrderStatusRepository
        )
        mockedMakeFindOrderByIdRepository = vi.mocked(
            findOrderRepoModule.makeFindOrderByIdRepository
        )
        mockedMakeFindPaymentByOrderIdRepository = vi.mocked(
            findPaymentRepoModule.makeFindPaymentByOrderIdRepository
        )
        mockedMakeUpdateOrderStatusUseCase = vi.mocked(
            useCaseModule.makeUpdateOrderStatusUseCase
        )
        if (mockedMakeUpdateOrderStatusRepository.mock)
            mockedMakeUpdateOrderStatusRepository.mockReset()
        if (mockedMakeFindOrderByIdRepository.mock)
            mockedMakeFindOrderByIdRepository.mockReset()
        if (mockedMakeFindPaymentByOrderIdRepository.mock)
            mockedMakeFindPaymentByOrderIdRepository.mockReset()
        if (mockedMakeUpdateOrderStatusUseCase.mock)
            mockedMakeUpdateOrderStatusUseCase.mockReset()
        if (mockedMakeUpdateOrderStatusRepository.mock)
            mockedMakeUpdateOrderStatusRepository.mockReturnValue(
                mockRepository
            )
        if (mockedMakeFindOrderByIdRepository.mock)
            mockedMakeFindOrderByIdRepository.mockReturnValue(
                mockFindOrderRepository
            )
        if (mockedMakeFindPaymentByOrderIdRepository.mock)
            mockedMakeFindPaymentByOrderIdRepository.mockReturnValue(
                mockFindPaymentRepository
            )
        if (mockedMakeUpdateOrderStatusUseCase.mock)
            mockedMakeUpdateOrderStatusUseCase.mockReturnValue(mockUseCase)
    // No typeorm initialization needed for Prisma
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeUpdateOrderStatusFactory()
        expect(repoModule.makeUpdateOrderStatusRepository).toHaveBeenCalled()
        expect(findOrderRepoModule.makeFindOrderByIdRepository).toHaveBeenCalled()
        expect(
            findPaymentRepoModule.makeFindPaymentByOrderIdRepository
        ).toHaveBeenCalled()
        expect(useCaseModule.makeUpdateOrderStatusUseCase).toHaveBeenCalledWith(
            mockRepository,
            mockFindOrderRepository,
            mockFindPaymentRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeUpdateOrderStatusRepository.mock)
            mockedMakeUpdateOrderStatusRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeUpdateOrderStatusFactory()).rejects.toThrow(
            "repo fail"
        )
    })

    it("propagates errors from find order repository", async () => {
        if (mockedMakeFindOrderByIdRepository.mock)
            mockedMakeFindOrderByIdRepository.mockRejectedValue(
                new Error("find order fail")
            )
        await expect(makeUpdateOrderStatusFactory()).rejects.toThrow(
            "find order fail"
        )
    })
})
