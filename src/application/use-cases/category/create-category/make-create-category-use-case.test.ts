import type { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"
import { describe, expect, it, vi } from "vitest"

import { makeCreateCategoryUseCase } from "./make-create-category-use-case"

describe.skip("makeCreateCategoryUseCase", () => {
    it("should create a CreateCategoryUseCase instance with the provided repository", () => {
        const mockRepository: CreateCategoryOutputPort = {
            create: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeCreateCategoryUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
