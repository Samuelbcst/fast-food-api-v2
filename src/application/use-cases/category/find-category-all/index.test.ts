import { describe, expect, it, vi } from "vitest"

import { FindCategoryAllUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe.skip("FindCategoryAllUseCase", () => {
    it("should return categories on success", async () => {
        const categories = [
            {
                id: 1,
                name: "cat",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        mockRepository.execute.mockResolvedValueOnce(categories)
        const useCase = new FindCategoryAllUseCase(mockRepository as any)
        const result = await useCase.execute()
        expect(result.success).toBe(true)
        expect(result.result).toEqual(categories)
    })

    it("should return empty array on error", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new FindCategoryAllUseCase(mockRepository as any)
        const result = await useCase.execute()
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
    })
})
