import type { FindCategoryAllRepository } from "@src/application/repositories/category/find-category-all-repository"
import { describe, expect, it, vi } from "vitest"

import { makeFindCategoryAllUseCase } from "./make-find-category-all-use-case"

describe("makeFindCategoryAllUseCase", () => {
    it("should create a FindCategoryAllUseCase instance with the provided repository", () => {
        const mockRepository: FindCategoryAllRepository = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeFindCategoryAllUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
