import type { FindCategoryByIdRepository } from "@src/application/repositories/category/find-category-by-id"
import { describe, expect, it, vi } from "vitest"

import { makeFindCategoryByIdUseCase } from "./make-find-category-by-id-use-case"

describe("makeFindCategoryByIdUseCase", () => {
    it("should create a FindCategoryByIdUseCase instance with the provided repository", () => {
        const mockRepository: FindCategoryByIdRepository = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeFindCategoryByIdUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
