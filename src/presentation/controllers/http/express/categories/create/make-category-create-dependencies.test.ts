import { makeCreateCategoryRepository } from "@persistence/prisma/category/create-category-repository/make-create-category-repository"
import { makeCreateCategoryUseCase } from "@application/use-cases/category/create-category/make-create-category-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeCreateCategoryFactory } from "./make-category-create-dependencies"

vi.mock(
    "@application/use-cases/category/create-category/make-create-category-use-case",
    () => ({
        makeCreateCategoryUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/category/create-category-repository/make-create-category-repository",
    () => ({
        makeCreateCategoryRepository: vi.fn(),
    })
)

describe("makeCreateCategoryFactory", () => {
    beforeEach(() => {
        ;(makeCreateCategoryUseCase as any).mockReset()
        ;(makeCreateCategoryRepository as any).mockReset()
    })

    it("should create and return the use case with the repository", async () => {
        const fakeRepo = {}
        const fakeUseCase = {}
        ;(makeCreateCategoryRepository as any).mockResolvedValue(fakeRepo)
        ;(makeCreateCategoryUseCase as any).mockReturnValue(fakeUseCase)
        const result = await makeCreateCategoryFactory()
        expect(makeCreateCategoryRepository).toHaveBeenCalled()
        expect(makeCreateCategoryUseCase).toHaveBeenCalledWith(fakeRepo)
        expect(result).toBe(fakeUseCase)
    })
})

export {}
