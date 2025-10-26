import { describe, expect, it, vi } from "vitest"

import { FindCategoryByIdUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe.skip("FindCategoryByIdUseCase", () => {
    it("should return category if found", async () => {
        const category = {
            id: 1,
            name: "cat",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        mockRepository.execute.mockResolvedValueOnce(category)
        const useCase = new FindCategoryByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(category)
    })

    it("should return error if not found", async () => {
        mockRepository.execute.mockResolvedValueOnce(null)
        const useCase = new FindCategoryByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should handle repository error", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new FindCategoryByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 3 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })
})
