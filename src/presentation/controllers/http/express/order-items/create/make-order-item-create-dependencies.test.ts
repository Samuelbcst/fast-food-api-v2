import * as repoModule from "@persistence/prisma/order-item/create-order-item-repository/make-create-order-item-repository"
import * as useCaseModule from "@application/use-cases/order-item/create-order-item/make-create-order-item-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeCreateOrderItemFactory } from "./make-order-item-create-dependencies"

vi.mock(
    "@application/use-cases/order-item/create-order-item/make-create-order-item-use-case",
    () => ({
        makeCreateOrderItemUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/order-item/create-order-item-repository/make-create-order-item-repository",
    () => ({
        makeCreateOrderItemOutputPort: vi.fn(),
    })
)

export {}

describe("makeCreateOrderItemFactory", () => {
    const mockRepository = { create: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeCreateOrderItemRepository: ReturnType<typeof vi.fn>
    let mockedMakeCreateOrderItemUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeCreateOrderItemRepository = vi.mocked(
            repoModule.makeCreateOrderItemOutputPort
        )
        mockedMakeCreateOrderItemUseCase = vi.mocked(
            useCaseModule.makeCreateOrderItemUseCase
        )
        if (mockedMakeCreateOrderItemRepository.mock)
            mockedMakeCreateOrderItemRepository.mockReset()
        if (mockedMakeCreateOrderItemUseCase.mock)
            mockedMakeCreateOrderItemUseCase.mockReset()
        if (mockedMakeCreateOrderItemRepository.mock)
            mockedMakeCreateOrderItemRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeCreateOrderItemUseCase.mock)
            mockedMakeCreateOrderItemUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeCreateOrderItemFactory()
        expect(repoModule.makeCreateOrderItemOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeCreateOrderItemUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeCreateOrderItemRepository.mock)
            mockedMakeCreateOrderItemRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeCreateOrderItemFactory()).rejects.toThrow("repo fail")
    })
})

export {}
