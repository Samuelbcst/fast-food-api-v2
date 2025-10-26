import type { DeleteCategoryOutputPort } from "@application/ports/output/category/delete-category-output-port"
import { describe, expect, it, vi } from "vitest"

import { makeDeleteCategoryUseCase } from "./make-delete-category-use-case"

describe.skip("makeDeleteCategoryUseCase", () => {
    it("should create a DeleteCategoryUseCase instance with the provided repository", () => {
        const mockRepository: DeleteCategoryOutputPort = {
            execute: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeDeleteCategoryUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
