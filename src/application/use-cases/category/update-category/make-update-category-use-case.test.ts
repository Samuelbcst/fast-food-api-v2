import type { UpdateCategoryRepository } from "@src/application/repositories/category/update-category"
import { describe, expect, it, vi } from "vitest"

import { makeUpdateCategoryUseCase } from "./make-update-category-use-case"

describe("makeUpdateCategoryUseCase", () => {
    it("should create an UpdateCategoryUseCase instance with the provided repository", () => {
        const mockRepository: UpdateCategoryRepository = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeUpdateCategoryUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
