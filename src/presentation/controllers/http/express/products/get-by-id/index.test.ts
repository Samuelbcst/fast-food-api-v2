import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeGetProductByIdFactory from "./make-product-get-by-id-dependencies"
import { getProductById } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe("getProductById", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeGetProductByIdFactory,
            "makeGetProductByIdFactory"
        ).mockResolvedValue(mockUseCase)
    })

    it("gets product by valid id", async () => {
        mockUseCase.execute.mockResolvedValue("product")
        const params = { id: "3" }
        const result = await getProductById(params)
        expect(
            makeGetProductByIdFactory.makeGetProductByIdFactory
        ).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 3 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("product")
    })

    it("throws if id is not a number", async () => {
        await expect(getProductById({ id: "bad" })).rejects.toThrow()
        expect(
            makeGetProductByIdFactory.makeGetProductByIdFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
