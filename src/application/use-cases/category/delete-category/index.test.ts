import { describe, expect, it, vi } from "vitest"

import { DeleteCategoryUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe("DeleteCategoryUseCase", () => {
    it("should return success and deleted category when found", async () => {
        const deletedCategory = {
            id: 1,
            name: "cat",
            description: "desc",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        mockRepository.execute.mockResolvedValueOnce(deletedCategory)
        const useCase = new DeleteCategoryUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(deletedCategory)
    })

    it("should return error when category not found", async () => {
        mockRepository.execute.mockResolvedValueOnce(null)
        const useCase = new DeleteCategoryUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should return error on repository failure", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new DeleteCategoryUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 3 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on onFinish", async () => {
        mockRepository.finish.mockResolvedValueOnce(undefined)
        const useCase = new DeleteCategoryUseCase(mockRepository as any)
        await expect(useCase.onFinish()).resolves.toBeUndefined()
        expect(mockRepository.finish).toHaveBeenCalled()
    })
})
