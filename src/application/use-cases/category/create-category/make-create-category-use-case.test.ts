import type { CreateCategoryRepository } from "@src/application/repositories/category/create-category"
import { describe, expect, it, vi } from "vitest"

import { makeCreateCategoryUseCase } from "./make-create-category-use-case"

describe("makeCreateCategoryUseCase", () => {
    it("should create a CreateCategoryUseCase instance with the provided repository", () => {
        const mockRepository: CreateCategoryRepository = {
            create: vi.fn(),
            finish: vi.fn(),
        }
        const useCase = makeCreateCategoryUseCase(mockRepository)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
