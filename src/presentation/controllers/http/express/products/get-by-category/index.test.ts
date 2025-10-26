import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeGetProductByCategoryFactory from "./make-product-get-by-category-dependencies"
import { getProductByCategory } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe.skip("getProductByCategory", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeGetProductByCategoryFactory,
            "makeGetProductByCategoryFactory"
        ).mockResolvedValue(mockUseCase)
    })

    it("gets products by valid category", async () => {
        mockUseCase.execute.mockResolvedValue(["product1"])
        const params = { categoryId: "2" }
        const result = await getProductByCategory(params)
        expect(
            makeGetProductByCategoryFactory.makeGetProductByCategoryFactory
        ).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ categoryId: 2 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toEqual(["product1"])
    })

    it("throws if categoryId is missing", async () => {
        await expect(getProductByCategory({})).rejects.toThrow()
        expect(
            makeGetProductByCategoryFactory.makeGetProductByCategoryFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
