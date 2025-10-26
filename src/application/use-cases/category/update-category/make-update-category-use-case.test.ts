import type { UpdateCategoryOutputPort } from "@application/ports/output/category/update-category-output-port"
import { describe, expect, it, vi } from "vitest"

import { makeUpdateCategoryUseCase } from "./make-update-category-use-case"

describe.skip("makeUpdateCategoryUseCase", () => {
    it("should create an UpdateCategoryUseCase instance with the provided repository", () => {
        const mockRepository: UpdateCategoryOutputPort = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeUpdateCategoryUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
