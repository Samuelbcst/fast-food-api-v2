import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreateProductUseCase } from "./index"

const input = { name: "prod", price: 1, categoryId: 1 }
const product = {
    id: 1,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
}

let repository: any
let useCase: CreateProductUseCase

beforeEach(() => {
    repository = {
        create: vi.fn().mockResolvedValue(product),
        finish: vi.fn().mockResolvedValue(undefined),
    }
    useCase = new CreateProductUseCase(repository)
})

describe("CreateProductUseCase", () => {
    it("should return success true when product is created", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(product)
        expect(repository.create).toHaveBeenCalledWith(input)
    })

    it("should return success false and error on failure", async () => {
        const errorMsg = "fail"
        repository.create = vi.fn().mockRejectedValue(new Error(errorMsg))
        useCase = new CreateProductUseCase(repository)
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
