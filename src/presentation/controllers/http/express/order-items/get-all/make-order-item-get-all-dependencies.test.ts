import * as repoModule from "@persistence/prisma/order-item/find-order-item-all-repository/make-find-order-item-all-repository"
import * as useCaseModule from "@application/use-cases/order-item/find-order-item-all/make-find-order-item-all-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetOrderItemAllFactory } from "./make-order-item-get-all-dependencies"

vi.mock(
    "@application/use-cases/order-item/find-order-item-all/make-find-order-item-all-use-case",
    () => ({
        makeFindOrderItemAllUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/order-item/find-order-item-all-repository/make-find-order-item-all-repository",
    () => ({
        makeFindOrderItemAllOutputPort: vi.fn(),
    })
)

export {}

describe("makeGetOrderItemAllFactory", () => {
    const mockRepository = { findAll: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindOrderItemAllRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindOrderItemAllUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindOrderItemAllRepository = vi.mocked(
            repoModule.makeFindOrderItemAllOutputPort
        )
        mockedMakeFindOrderItemAllUseCase = vi.mocked(
            useCaseModule.makeFindOrderItemAllUseCase
        )
        if (mockedMakeFindOrderItemAllRepository.mock)
            mockedMakeFindOrderItemAllRepository.mockReset()
        if (mockedMakeFindOrderItemAllUseCase.mock)
            mockedMakeFindOrderItemAllUseCase.mockReset()
        if (mockedMakeFindOrderItemAllRepository.mock)
            mockedMakeFindOrderItemAllRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindOrderItemAllUseCase.mock)
            mockedMakeFindOrderItemAllUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetOrderItemAllFactory()
        expect(repoModule.makeFindOrderItemAllOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeFindOrderItemAllUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindOrderItemAllRepository.mock)
            mockedMakeFindOrderItemAllRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetOrderItemAllFactory()).rejects.toThrow("repo fail")
    })
})

export {}
