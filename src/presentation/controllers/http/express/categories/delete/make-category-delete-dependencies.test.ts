import * as repoModule from "@persistence/prisma/category/delete-category-repository/make-delete-category-repository"
import * as useCaseModule from "@use-cases/category/delete-category/make-delete-category-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeDeleteCategoryFactory } from "./make-category-delete-dependencies"

vi.mock(
    "@persistence/prisma/category/delete-category-repository/make-delete-category-repository",
    () => ({
        makeDeleteCategoryRepository: vi.fn(),
    })
)
vi.mock(
    "@use-cases/category/delete-category/make-delete-category-use-case",
    () => ({
        makeDeleteCategoryUseCase: vi.fn(),
    })
)

describe("makeDeleteCategoryFactory", () => {
    const mockRepo = {
        execute: vi.fn(),
        finish: vi.fn(),
    } as unknown as typeof repoModule.makeDeleteCategoryRepository
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
    } as unknown as typeof useCaseModule.makeDeleteCategoryUseCase

    beforeEach(() => {
        ;(repoModule.makeDeleteCategoryRepository as any).mockReset()
        ;(useCaseModule.makeDeleteCategoryUseCase as any).mockReset()
        ;(repoModule.makeDeleteCategoryRepository as any).mockResolvedValue(
            mockRepo
        )
        ;(useCaseModule.makeDeleteCategoryUseCase as any).mockReturnValue(
            mockUseCase
        )
    })

    it("should create and return the use case with the repository", async () => {
        const result = await makeDeleteCategoryFactory()
        expect(repoModule.makeDeleteCategoryRepository).toHaveBeenCalled()
        expect(useCaseModule.makeDeleteCategoryUseCase).toHaveBeenCalledWith(
            mockRepo
        )
        expect(result).toBe(mockUseCase)
    })
})

export {}
