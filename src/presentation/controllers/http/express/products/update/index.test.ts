import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeUpdateProductFactory from "./make-product-update-dependencies"
import { updateProduct } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe("updateProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeUpdateProductFactory,
            "makeUpdateProductFactory"
        ).mockResolvedValue(mockUseCase)
    })

    it("updates product with valid input", async () => {
        mockUseCase.execute.mockResolvedValue("update-result")
        const params = { id: "4" }
        const body = { name: "Updated", price: 20 }
        const result = await updateProduct(params, body)
        expect(
            makeUpdateProductFactory.makeUpdateProductFactory
        ).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            id: 4,
            name: "Updated",
            price: 20,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("update-result")
    })

    it("throws if id is not a number", async () => {
        await expect(updateProduct({ id: "bad" }, {})).rejects.toThrow()
        expect(
            makeUpdateProductFactory.makeUpdateProductFactory
        ).not.toHaveBeenCalled()
    })

    it("throws if body is invalid", async () => {
        await expect(
            updateProduct({ id: "1" }, { price: "bad" })
        ).rejects.toThrow()
        expect(mockUseCase.execute).not.toHaveBeenCalled()
    })
})
export {}
