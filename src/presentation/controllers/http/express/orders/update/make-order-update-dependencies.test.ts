import * as repoModule from "@persistence/prisma/order/update-order-repository/make-update-order-repository"
import * as useCaseModule from "@application/use-cases/order/update-order/make-update-order-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeUpdateOrderFactory } from "./make-order-update-dependencies"

vi.mock("@application/use-cases/order/update-order/make-update-order-use-case", () => ({
    makeUpdateOrderUseCase: vi.fn(),
}))
vi.mock(
    "@persistence/prisma/order/update-order-repository/make-update-order-repository",
    () => ({
        makeUpdateOrderOutputPort: vi.fn(),
    })
)

export {}

describe("makeUpdateOrderFactory", () => {
    const mockRepository = { update: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeUpdateOrderRepository: ReturnType<typeof vi.fn>
    let mockedMakeUpdateOrderUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeUpdateOrderRepository = vi.mocked(
            repoModule.makeUpdateOrderOutputPort
        )
        mockedMakeUpdateOrderUseCase = vi.mocked(
            useCaseModule.makeUpdateOrderUseCase
        )
        if (mockedMakeUpdateOrderRepository.mock)
            mockedMakeUpdateOrderRepository.mockReset()
        if (mockedMakeUpdateOrderUseCase.mock)
            mockedMakeUpdateOrderUseCase.mockReset()
        if (mockedMakeUpdateOrderRepository.mock)
            mockedMakeUpdateOrderRepository.mockResolvedValue(mockRepository)
        if (mockedMakeUpdateOrderUseCase.mock)
            mockedMakeUpdateOrderUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeUpdateOrderFactory()
        expect(repoModule.makeUpdateOrderOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeUpdateOrderUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeUpdateOrderRepository.mock)
            mockedMakeUpdateOrderRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeUpdateOrderFactory()).rejects.toThrow("repo fail")
    })
})

export {}
