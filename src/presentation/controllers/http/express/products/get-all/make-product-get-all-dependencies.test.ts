import * as repoModule from "@persistence/prisma/product/find-product-all-repository/make-find-product-all-repository"
import * as useCaseModule from "@use-cases/product/find-product-all/make-find-product-all-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetProductAllFactory } from "./make-product-get-all-dependencies"

vi.mock(
    "@use-cases/product/find-product-all/make-find-product-all-use-case",
    () => ({
        makeFindProductAllUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/product/find-product-all-repository/make-find-product-all-repository",
    () => ({
        makeFindProductAllRepository: vi.fn(),
    })
)

describe("makeGetProductAllFactory", () => {
    const mockRepository = { findAll: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindProductAllRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindProductAllUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindProductAllRepository = vi.mocked(
            repoModule.makeFindProductAllRepository
        )
        mockedMakeFindProductAllUseCase = vi.mocked(
            useCaseModule.makeFindProductAllUseCase
        )
        if (mockedMakeFindProductAllRepository.mock)
            mockedMakeFindProductAllRepository.mockReset()
        if (mockedMakeFindProductAllUseCase.mock)
            mockedMakeFindProductAllUseCase.mockReset()
        if (mockedMakeFindProductAllRepository.mock)
            mockedMakeFindProductAllRepository.mockResolvedValue(mockRepository)
        if (mockedMakeFindProductAllUseCase.mock)
            mockedMakeFindProductAllUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetProductAllFactory()
        expect(repoModule.makeFindProductAllRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindProductAllUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindProductAllRepository.mock)
            mockedMakeFindProductAllRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetProductAllFactory()).rejects.toThrow("repo fail")
    })
})
export {}
