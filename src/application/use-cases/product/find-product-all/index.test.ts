import { describe, expect, it, vi } from "vitest"

import { FindProductAllUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe("FindProductAllUseCase", () => {
    it("should return products on success", async () => {
        const products = [
            {
                id: 1,
                name: "prod",
                price: 1,
                categoryId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        mockRepository.execute.mockResolvedValueOnce(products)
        const useCase = new FindProductAllUseCase(mockRepository as any)
        const result = await useCase.execute()
        expect(result.success).toBe(true)
        expect(result.result).toEqual(products)
    })

    it("should return empty array on error", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new FindProductAllUseCase(mockRepository as any)
        const result = await useCase.execute()
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
    })
})
