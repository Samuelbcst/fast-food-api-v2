import * as repoModule from "@persistence/prisma/order/find-order-all-repository/make-find-order-all-repository"
import * as useCaseModule from "@application/use-cases/order/find-order-all/make-find-order-all-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetOrderAllFactory } from "./make-order-get-all-dependencies"

vi.mock("@application/use-cases/order/find-order-all/make-find-order-all-use-case", () => ({
    makeFindOrderAllUseCase: vi.fn(),
}))
vi.mock(
    "@persistence/prisma/order/find-order-all-repository/make-find-order-all-repository",
    () => ({
        makeFindOrderAllOutputPort: vi.fn(),
    })
)

export {}

describe("makeGetOrderAllFactory", () => {
    const mockRepository = { findAll: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindOrderAllRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindOrderAllUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindOrderAllRepository = vi.mocked(
            repoModule.makeFindOrderAllOutputPort
        )
        mockedMakeFindOrderAllUseCase = vi.mocked(
            useCaseModule.makeFindOrderAllUseCase
        )
        if (mockedMakeFindOrderAllRepository.mock)
            mockedMakeFindOrderAllRepository.mockReset()
        if (mockedMakeFindOrderAllUseCase.mock)
            mockedMakeFindOrderAllUseCase.mockReset()
        if (mockedMakeFindOrderAllRepository.mock)
            mockedMakeFindOrderAllRepository.mockResolvedValue(mockRepository)
        if (mockedMakeFindOrderAllUseCase.mock)
            mockedMakeFindOrderAllUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetOrderAllFactory()
        expect(repoModule.makeFindOrderAllOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeFindOrderAllUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindOrderAllRepository.mock)
            mockedMakeFindOrderAllRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetOrderAllFactory()).rejects.toThrow("repo fail")
    })
})

export {}
