import type { UpdateCategoryOutputPort } from "@application/ports/output/category/update-category-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { UpdateCategoryUseCase } from "."

const input = { id: 1, name: "Test Category", description: "desc" }
const category = {
    id: 1,
    name: "Test Category",
    description: "desc",
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe.skip("UpdateCategoryUseCase", () => {
    let repository: UpdateCategoryOutputPort
    let useCase: UpdateCategoryUseCase

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(category),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new UpdateCategoryUseCase(repository)
    })

    it("should return success true and the updated category when found", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(category)
        expect(repository.execute).toHaveBeenCalledWith(input)
    })

    it("should return success false and CustomError when category not found", async () => {
        repository.execute = vi.fn().mockResolvedValue(null)
        useCase = new UpdateCategoryUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Category not found.")
    })

    it("should return success false on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new UpdateCategoryUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
