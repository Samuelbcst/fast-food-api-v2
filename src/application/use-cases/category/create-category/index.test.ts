import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreateCategoryUseCase } from "./index"

const input = { name: "cat", description: "desc" }
const category = {
    id: 1,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
}

let repository: any
let useCase: CreateCategoryUseCase

beforeEach(() => {
    repository = {
        create: vi.fn().mockResolvedValue(category),
        finish: vi.fn().mockResolvedValue(undefined),
    }
    useCase = new CreateCategoryUseCase(repository)
})

describe("CreateCategoryUseCase", () => {
    it("should return success true when category is created", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(category)
        expect(repository.create).toHaveBeenCalledWith(input)
    })

    it("should return success false and error on failure", async () => {
        const errorMsg = "fail"
        repository.create = vi.fn().mockRejectedValue(new Error(errorMsg))
        useCase = new CreateCategoryUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
