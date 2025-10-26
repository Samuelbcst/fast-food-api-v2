import type { FindCategoryAllOutputPort } from "@application/ports/output/category/find-category-all-output-port"
import { describe, expect, it, vi } from "vitest"

import { makeFindCategoryAllUseCase } from "./make-find-category-all-use-case"

describe.skip("makeFindCategoryAllUseCase", () => {
    it("should create a FindCategoryAllUseCase instance with the provided repository", () => {
        const mockRepository: FindCategoryAllOutputPort = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeFindCategoryAllUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
