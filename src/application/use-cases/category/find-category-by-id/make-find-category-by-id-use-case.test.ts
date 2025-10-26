import type { FindCategoryByIdOutputPort } from "@application/ports/output/category/find-category-by-id-output-port"
import { describe, expect, it, vi } from "vitest"

import { makeFindCategoryByIdUseCase } from "./make-find-category-by-id-use-case"

describe.skip("makeFindCategoryByIdUseCase", () => {
    it("should create a FindCategoryByIdUseCase instance with the provided repository", () => {
        const mockRepository: FindCategoryByIdOutputPort = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeFindCategoryByIdUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
