import * as repoModule from "@persistence/prisma/order-item/find-order-item-by-id-repository/make-find-order-item-by-id-repository"
import * as useCaseModule from "@use-cases/order-item/find-order-item-by-id/make-find-order-item-by-id-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetOrderItemByIdFactory } from "./make-order-item-get-by-id-dependencies"

vi.mock(
    "@use-cases/order-item/find-order-item-by-id/make-find-order-item-by-id-use-case",
    () => ({
        makeFindOrderItemByIdUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/order-item/find-order-item-by-id-repository/make-find-order-item-by-id-repository",
    () => ({
        makeFindOrderItemByIdRepository: vi.fn(),
    })
)

export {}

describe("makeGetOrderItemByIdFactory", () => {
    const mockRepository = { findById: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindOrderItemByIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindOrderItemByIdUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindOrderItemByIdRepository = vi.mocked(
            repoModule.makeFindOrderItemByIdRepository
        )
        mockedMakeFindOrderItemByIdUseCase = vi.mocked(
            useCaseModule.makeFindOrderItemByIdUseCase
        )
        if (mockedMakeFindOrderItemByIdRepository.mock)
            mockedMakeFindOrderItemByIdRepository.mockReset()
        if (mockedMakeFindOrderItemByIdUseCase.mock)
            mockedMakeFindOrderItemByIdUseCase.mockReset()
        if (mockedMakeFindOrderItemByIdRepository.mock)
            mockedMakeFindOrderItemByIdRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindOrderItemByIdUseCase.mock)
            mockedMakeFindOrderItemByIdUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetOrderItemByIdFactory()
        expect(repoModule.makeFindOrderItemByIdRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindOrderItemByIdUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindOrderItemByIdRepository.mock)
            mockedMakeFindOrderItemByIdRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetOrderItemByIdFactory()).rejects.toThrow("repo fail")
    })
})

export {}
