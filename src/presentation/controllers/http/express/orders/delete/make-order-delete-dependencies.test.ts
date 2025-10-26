import * as repoModule from "@persistence/prisma/order/delete-order-repository/make-delete-order-repository"
import * as useCaseModule from "@application/use-cases/order/delete-order/make-delete-order-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeDeleteOrderFactory } from "./make-order-delete-dependencies"

vi.mock("@application/use-cases/order/delete-order/make-delete-order-use-case", () => ({
    makeDeleteOrderUseCase: vi.fn(),
}))
vi.mock(
    "@persistence/prisma/order/delete-order-repository/make-delete-order-repository",
    () => ({
        makeDeleteOrderOutputPort: vi.fn(),
    })
)

export {}

describe("makeDeleteOrderFactory", () => {
    const mockRepository = { delete: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeDeleteOrderRepository: ReturnType<typeof vi.fn>
    let mockedMakeDeleteOrderUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeDeleteOrderRepository = vi.mocked(
            repoModule.makeDeleteOrderOutputPort
        )
        mockedMakeDeleteOrderUseCase = vi.mocked(
            useCaseModule.makeDeleteOrderUseCase
        )
        if (mockedMakeDeleteOrderRepository.mock)
            mockedMakeDeleteOrderRepository.mockReset()
        if (mockedMakeDeleteOrderUseCase.mock)
            mockedMakeDeleteOrderUseCase.mockReset()
        if (mockedMakeDeleteOrderRepository.mock)
            mockedMakeDeleteOrderRepository.mockResolvedValue(mockRepository)
        if (mockedMakeDeleteOrderUseCase.mock)
            mockedMakeDeleteOrderUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeDeleteOrderFactory()
        expect(repoModule.makeDeleteOrderOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeDeleteOrderUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeDeleteOrderRepository.mock)
            mockedMakeDeleteOrderRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeDeleteOrderFactory()).rejects.toThrow("repo fail")
    })
})

export {}
