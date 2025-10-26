import * as repoModule from "@persistence/prisma/category/find-category-all-repository/make-find-category-all-repository"
import * as useCaseModule from "@application/use-cases/category/find-category-all/make-find-category-all-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeGetCategoryAllFactory } from "./make-category-get-all-dependencies"

vi.mock(
    "@persistence/prisma/category/find-category-all-repository/make-find-category-all-repository",
    () => ({
        makeFindCategoryAllRepository: vi.fn(),
    })
)
vi.mock(
    "@application/use-cases/category/find-category-all/make-find-category-all-use-case",
    () => ({
        makeFindCategoryAllUseCase: vi.fn(),
    })
)

describe("makeGetCategoryAllFactory", () => {
    const mockRepo = {}
    const mockUseCase = {}
    let mockedMakeFindCategoryAllRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindCategoryAllUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindCategoryAllRepository = vi.mocked(
            repoModule.makeFindCategoryAllRepository
        )
        mockedMakeFindCategoryAllUseCase = vi.mocked(
            useCaseModule.makeFindCategoryAllUseCase
        )
        if (mockedMakeFindCategoryAllRepository.mock)
            mockedMakeFindCategoryAllRepository.mockReset()
        if (mockedMakeFindCategoryAllUseCase.mock)
            mockedMakeFindCategoryAllUseCase.mockReset()
        if (mockedMakeFindCategoryAllRepository.mock)
            mockedMakeFindCategoryAllRepository.mockResolvedValue(mockRepo)
        if (mockedMakeFindCategoryAllUseCase.mock)
            mockedMakeFindCategoryAllUseCase.mockReturnValue(mockUseCase)
    })

    it("should create and return the use case with the repository", async () => {
        const result = await makeGetCategoryAllFactory()
        expect(repoModule.makeFindCategoryAllRepository).toHaveBeenCalled()
        expect(useCaseModule.makeFindCategoryAllUseCase).toHaveBeenCalledWith(
            mockRepo
        )
        expect(result).toBe(mockUseCase)
    })
})

export {}
