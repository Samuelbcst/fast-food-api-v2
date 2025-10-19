import { describe, expect, it, vi } from "vitest"

import { UpdateOrderStatusUseCase } from "./index"

const mockRepository = {
    execute: vi.fn(),
    finish: vi.fn(),
}

describe("UpdateOrderStatusUseCase", () => {
    it("should return success on update status", async () => {
        const mockOrder = {
            id: 1,
            customerId: 1,
            items: [],
            status: "READY",
            createdAt: new Date(),
            statusUpdatedAt: new Date(),
            totalAmount: 20,
        }
        mockRepository.execute.mockResolvedValueOnce(mockOrder)
        const useCase = new UpdateOrderStatusUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1, status: "READY" })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(mockOrder)
    })

    it("should return error on failure", async () => {
        mockRepository.execute.mockRejectedValueOnce(new Error("fail"))
        const useCase = new UpdateOrderStatusUseCase(mockRepository as any)
        const result = await useCase.execute({ id: 1, status: "READY" })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })
})
