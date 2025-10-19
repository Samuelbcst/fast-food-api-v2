import type { DeleteCategoryRepository } from "@src/application/repositories/category/delete-category-repository"
import { describe, expect, it, vi } from "vitest"

import { makeDeleteCategoryUseCase } from "./make-delete-category-use-case"

describe("makeDeleteCategoryUseCase", () => {
    it("should create a DeleteCategoryUseCase instance with the provided repository", () => {
        const mockRepository: DeleteCategoryRepository = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeDeleteCategoryUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
