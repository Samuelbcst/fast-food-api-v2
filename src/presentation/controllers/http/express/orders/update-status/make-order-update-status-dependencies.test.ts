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
    "@persistence/prisma/order/update-order-status-repository/make-update-order-status-repository",
    () => ({
        makeUpdateOrderStatusRepository: vi.fn(),
    })
)

export {}

describe("makeUpdateOrderStatusFactory", () => {
    const mockRepository = { updateStatus: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeUpdateOrderStatusRepository: ReturnType<typeof vi.fn>
    let mockedMakeUpdateOrderStatusUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeUpdateOrderStatusRepository = vi.mocked(
            repoModule.makeUpdateOrderStatusRepository
        )
        mockedMakeUpdateOrderStatusUseCase = vi.mocked(
            useCaseModule.makeUpdateOrderStatusUseCase
        )
        if (mockedMakeUpdateOrderStatusRepository.mock)
            mockedMakeUpdateOrderStatusRepository.mockReset()
        if (mockedMakeUpdateOrderStatusUseCase.mock)
            mockedMakeUpdateOrderStatusUseCase.mockReset()
        if (mockedMakeUpdateOrderStatusRepository.mock)
            mockedMakeUpdateOrderStatusRepository.mockReturnValue(
                mockRepository
            )
        if (mockedMakeUpdateOrderStatusUseCase.mock)
            mockedMakeUpdateOrderStatusUseCase.mockReturnValue(mockUseCase)
    // No typeorm initialization needed for Prisma
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeUpdateOrderStatusFactory()
        expect(repoModule.makeUpdateOrderStatusRepository).toHaveBeenCalled()
        expect(useCaseModule.makeUpdateOrderStatusUseCase).toHaveBeenCalledWith(
            mockRepository
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
})
