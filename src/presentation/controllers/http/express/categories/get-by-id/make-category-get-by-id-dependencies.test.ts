import * as repoModule from "@persistence/prisma/category/find-category-by-id-repository/make-find-category-by-id-repository"
import * as useCaseModule from "@use-cases/category/find-category-by-id/make-find-category-by-id-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeGetCategoryByIdFactory } from "./make-category-get-by-id-dependencies"

// Hoist mocks for both dependencies
vi.mock(
    "@use-cases/category/find-category-by-id/make-find-category-by-id-use-case",
    () => ({
        makeFindCategoryByIdUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/category/find-category-by-id-repository/make-find-category-by-id-repository",
    () => ({
        makeFindCategoryByIdRepository: vi.fn(),
    })
)

export {}

describe("makeGetCategoryByIdFactory", () => {
    const mockRepository = { findById: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindCategoryByIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindCategoryByIdUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindCategoryByIdRepository = vi.mocked(
            repoModule.makeFindCategoryByIdRepository
        )
        mockedMakeFindCategoryByIdUseCase = vi.mocked(
            useCaseModule.makeFindCategoryByIdUseCase
        )
        if (mockedMakeFindCategoryByIdRepository.mock)
            mockedMakeFindCategoryByIdRepository.mockReset()
        if (mockedMakeFindCategoryByIdUseCase.mock)
            mockedMakeFindCategoryByIdUseCase.mockReset()
        if (mockedMakeFindCategoryByIdRepository.mock)
            mockedMakeFindCategoryByIdRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindCategoryByIdUseCase.mock)
            mockedMakeFindCategoryByIdUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetCategoryByIdFactory()
        expect(repoModule.makeFindCategoryByIdRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindCategoryByIdUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindCategoryByIdRepository.mock)
            mockedMakeFindCategoryByIdRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetCategoryByIdFactory()).rejects.toThrow("repo fail")
    })
})

export {}
