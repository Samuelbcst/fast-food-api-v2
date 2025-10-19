import { describe, expect, it, vi } from "vitest"

import { FindProductByIdUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe("FindProductByIdUseCase", () => {
    it("should return product if found", async () => {
        const product = {
            id: 1,
            name: "prod",
            price: 1,
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        mockRepository.execute.mockResolvedValueOnce(product)
        const useCase = new FindProductByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(product)
    })

    it("should return error if not found", async () => {
        mockRepository.execute.mockResolvedValueOnce(null)
        const useCase = new FindProductByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should handle repository error", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new FindProductByIdUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 3 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })
})
