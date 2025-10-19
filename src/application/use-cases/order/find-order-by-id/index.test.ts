import { describe, expect, it, vi } from "vitest"

import { FindOrderByIdUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe("FindOrderByIdUseCase", () => {
    it("should return success on find", async () => {
        mockRepository.execute.mockResolvedValueOnce({})
        const useCase = new FindOrderByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).not.toBeNull()
    })

    it("should return error on not found", async () => {
        mockRepository.execute.mockResolvedValueOnce(null)
        const useCase = new FindOrderByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should return error on failure", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new FindOrderByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })
})
