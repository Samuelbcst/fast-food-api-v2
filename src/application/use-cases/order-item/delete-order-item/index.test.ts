import { describe, expect, it, vi } from "vitest"

import { DeleteOrderItemUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe("DeleteOrderItemUseCase", () => {
    it("should return order item if deleted", async () => {
        const orderItem = { id: 1 }
        mockRepository.execute.mockResolvedValueOnce(orderItem)
        const useCase = new DeleteOrderItemUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(orderItem)
    })

    it("should return error if not found", async () => {
        mockRepository.execute.mockResolvedValueOnce(null)
        const useCase = new DeleteOrderItemUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should handle repository error", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new DeleteOrderItemUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 3 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })
})
