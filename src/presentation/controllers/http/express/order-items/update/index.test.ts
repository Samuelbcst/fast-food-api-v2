import { beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"
import * as productFactoryModule from "../../products/get-by-id/make-product-get-by-id-dependencies"
import * as factoryModule from "./make-order-item-update-dependencies"
import { updateOrderItem } from "./index"

vi.mock("./make-order-item-update-dependencies", () => ({
    makeUpdateOrderItemFactory: vi.fn(),
}))
vi.mock("../../products/get-by-id/make-product-get-by-id-dependencies", () => ({
    makeGetProductByIdFactory: vi.fn(),
}))

export {}

describe("updateOrderItem", () => {
    const mockProductUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        findProductByIdRepository: {} as any,
    }
    const mockOrderItemUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        updateOrderItemRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(
            productFactoryModule.makeGetProductByIdFactory
        ).mockResolvedValue(mockProductUseCase as any)
        vi.mocked(factoryModule.makeUpdateOrderItemFactory).mockResolvedValue(
            mockOrderItemUseCase as any
        )
        mockProductUseCase.execute.mockResolvedValue({
            success: true,
            result: { name: "prod", price: 10 },
        })
        mockProductUseCase.onFinish.mockResolvedValue(undefined)
        mockOrderItemUseCase.execute.mockResolvedValue("orderItemResult")
        mockOrderItemUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("validates input, fetches product, calls use case, and returns result", async () => {
        const params = { id: "1" }
        const body = { productId: 2, quantity: 3 }
        const result = await updateOrderItem(params, body)
        expect(
            productFactoryModule.makeGetProductByIdFactory
        ).toHaveBeenCalled()
        expect(mockProductUseCase.execute).toHaveBeenCalledWith({ id: 2 })
        expect(factoryModule.makeUpdateOrderItemFactory).toHaveBeenCalled()
        expect(mockOrderItemUseCase.execute).toHaveBeenCalledWith({
            id: 1,
            productId: 2,
            quantity: 3,
            productName: "prod",
            unitPrice: 10,
        })
        expect(mockOrderItemUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("orderItemResult")
    })

    it("throws if product not found", async () => {
        mockProductUseCase.execute.mockResolvedValue({
            success: false,
            result: null,
        })
        await expect(
            updateOrderItem({ id: "1" }, { productId: 2, quantity: 3 })
        ).rejects.toThrow("Product not found")
    })

    it("throws if id is not a number", async () => {
        await expect(
            updateOrderItem({ id: "abc" }, { productId: 2, quantity: 3 })
        ).rejects.toThrow("Id must be a number")
    })

    it("throws if input is invalid", async () => {
        await expect(
            updateOrderItem({ id: "1" }, { productId: 0, quantity: 0 })
        ).rejects.toThrow(z.ZodError)
    })

    it("propagates errors from use case", async () => {
        mockOrderItemUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(
            updateOrderItem({ id: "1" }, { productId: 2, quantity: 3 })
        ).rejects.toThrow("fail")
    })
})

export {}
