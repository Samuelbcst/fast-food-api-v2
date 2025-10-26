import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeDeleteProductFactory from "./make-product-delete-dependencies"
import { deleteProduct } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe.skip("deleteProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeDeleteProductFactory,
            "makeDeleteProductFactory"
        ).mockResolvedValue(mockUseCase)
    })

    it("deletes product with valid id", async () => {
        mockUseCase.execute.mockResolvedValue("delete-result")
        const params = { id: "1" }
        const result = await deleteProduct(params)
        expect(
            makeDeleteProductFactory.makeDeleteProductFactory
        ).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 1 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("delete-result")
    })

    it("throws if id is not a number", async () => {
        await expect(deleteProduct({ id: "bad" })).rejects.toThrow()
        expect(
            makeDeleteProductFactory.makeDeleteProductFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
