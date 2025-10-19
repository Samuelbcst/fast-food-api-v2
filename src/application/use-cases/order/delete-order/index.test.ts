import { describe, expect, it, vi } from "vitest"

import { DeleteOrderUseCase } from "./index"

const mockRepository = {
    delete: vi.fn(),
    finish: vi.fn(),
}

describe("DeleteOrderUseCase", () => {
    it("should return success on delete", async () => {
        mockRepository.delete.mockResolvedValueOnce({})
        const useCase = new DeleteOrderUseCase({
            execute: mockRepository.delete,
            finish: mockRepository.finish,
        } as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).not.toBeNull()
    })

    it("should return error on failure", async () => {
        mockRepository.delete.mockRejectedValueOnce(new Error("fail"))
        const useCase = new DeleteOrderUseCase({
            execute: mockRepository.delete,
            finish: mockRepository.finish,
        } as any)
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeUndefined()
    })
})
