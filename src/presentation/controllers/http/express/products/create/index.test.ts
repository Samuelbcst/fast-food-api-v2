import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeProductFactory from "./make-product-create-dependencies"
import { createProduct } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe.skip("createProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeProductFactory,
            "makeCreateProductFactory"
        ).mockResolvedValue(mockUseCase)
    })

    it("creates product with valid input and returns result", async () => {
        mockUseCase.execute.mockResolvedValue("product-result")
        const body = {
            name: "Test",
            description: "desc",
            price: 10,
            categoryId: 1,
            active: true,
        }
        const result = await createProduct({}, body)
        expect(makeProductFactory.makeCreateProductFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: "Test",
            description: "desc",
            price: 10,
            categoryId: 1,
            active: true,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("product-result")
    })

    it("throws if input is invalid", async () => {
        await expect(
            createProduct({}, { name: "", price: -1, categoryId: "bad" })
        ).rejects.toThrow()
        expect(
            makeProductFactory.makeCreateProductFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
