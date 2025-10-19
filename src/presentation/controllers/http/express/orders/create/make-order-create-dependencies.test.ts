import * as repoModule from "@persistence/prisma/order/create-order-repository/make-create-order-repository"
import * as useCaseModule from "@use-cases/order/create-order/make-create-order-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeCreateOrderFactory } from "./make-order-create-dependencies"

vi.mock("@use-cases/order/create-order/make-create-order-use-case", () => ({
    makeCreateOrderUseCase: vi.fn(),
}))
vi.mock(
    "@persistence/prisma/order/create-order-repository/make-create-order-repository",
    () => ({
        makeCreateOrderRepository: vi.fn(),
    })
)

export {}

describe("makeCreateOrderFactory", () => {
    const mockRepository = { create: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeCreateOrderRepository: ReturnType<typeof vi.fn>
    let mockedMakeCreateOrderUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeCreateOrderRepository = vi.mocked(
            repoModule.makeCreateOrderRepository
        )
        mockedMakeCreateOrderUseCase = vi.mocked(
            useCaseModule.makeCreateOrderUseCase
        )
        if (mockedMakeCreateOrderRepository.mock)
            mockedMakeCreateOrderRepository.mockReset()
        if (mockedMakeCreateOrderUseCase.mock)
            mockedMakeCreateOrderUseCase.mockReset()
        if (mockedMakeCreateOrderRepository.mock)
            mockedMakeCreateOrderRepository.mockResolvedValue(mockRepository)
        if (mockedMakeCreateOrderUseCase.mock)
            mockedMakeCreateOrderUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeCreateOrderFactory()
        expect(repoModule.makeCreateOrderRepository).toHaveBeenCalled()
        expect(useCaseModule.makeCreateOrderUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeCreateOrderRepository.mock)
            mockedMakeCreateOrderRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeCreateOrderFactory()).rejects.toThrow("repo fail")
    })
})

export {}
