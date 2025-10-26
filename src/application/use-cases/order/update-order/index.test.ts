import { describe, expect, it, vi } from "vitest"

import { UpdateOrderUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe.skip("UpdateOrderUseCase", () => {
    it("should return success on update", async () => {
        const mockOrder = {
            id: 1,
            customerId: 1,
            items: [],
            status: "RECEIVED",
            createdAt: new Date(),
            statusUpdatedAt: new Date(),
            totalAmount: 10,
        }
        mockRepository.execute.mockResolvedValueOnce(mockOrder)
        const useCase = new UpdateOrderUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1, items: [] })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(mockOrder)
    })

    it("should return error on failure", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new UpdateOrderUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1, items: [] })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })
})
