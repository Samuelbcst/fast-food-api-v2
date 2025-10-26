import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeProductFactory from "../../products/get-by-id/make-product-get-by-id-dependencies"
import * as makeOrderFactory from "./make-order-update-dependencies"
import { updateOrder } from "./index"

const mockProductUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
    findProductByIdRepository: undefined, // satisfy type
} as any // cast to any to ignore private property
const mockOrderUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
    repository: undefined, // satisfy type
} as any // cast to any to ignore private property

describe.skip("updateOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeProductFactory,
            "makeGetProductByIdFactory"
        ).mockResolvedValue(mockProductUseCase)
        vi.spyOn(makeOrderFactory, "makeUpdateOrderFactory").mockResolvedValue(
            mockOrderUseCase
        )
    })

    it("updates order with valid input and returns result", async () => {
        const now = new Date()
        vi.useFakeTimers().setSystemTime(now)
        mockProductUseCase.execute.mockResolvedValue({
            success: true,
            result: { name: "P", price: 10 },
        })
        mockOrderUseCase.execute.mockResolvedValue("order-result")
        const params = { id: "1" }
        const body = { customerId: 2, items: [{ productId: 3, quantity: 4 }] }
        const result = await updateOrder(params, body)
        expect(makeProductFactory.makeGetProductByIdFactory).toHaveBeenCalled()
        expect(mockProductUseCase.execute).toHaveBeenCalledWith({ id: 3 })
        expect(mockProductUseCase.onFinish).toHaveBeenCalled()
        expect(makeOrderFactory.makeUpdateOrderFactory).toHaveBeenCalled()
        expect(mockOrderUseCase.execute).toHaveBeenCalledWith({
            id: 1,
            customerId: 2,
            items: [
                expect.objectContaining({
                    productId: 3,
                    quantity: 4,
                    productName: "P",
                    unitPrice: 10,
                    createdAt: now,
                    updatedAt: now,
                }),
            ],
            totalAmount: 40,
        })
        expect(mockOrderUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("order-result")
        vi.useRealTimers()
    })

    it("updates order with only id", async () => {
        mockOrderUseCase.execute.mockResolvedValue("order-result")
        const params = { id: "1" }
        const body = {}
        const result = await updateOrder(params, body)
        expect(makeOrderFactory.makeUpdateOrderFactory).toHaveBeenCalled()
        expect(mockOrderUseCase.execute).toHaveBeenCalledWith({ id: 1 })
        expect(result).toBe("order-result")
    })

    it("throws if product not found", async () => {
        mockProductUseCase.execute.mockResolvedValue({ success: false })
        const params = { id: "1" }
        const body = { items: [{ productId: 3, quantity: 4 }] }
        await expect(updateOrder(params, body)).rejects.toThrow(
            "Product not found: 3"
        )
        expect(mockProductUseCase.onFinish).toHaveBeenCalled()
    })

    it("throws if id is not a number", async () => {
        await expect(updateOrder({ id: "abc" }, {})).rejects.toThrow(
            "Id must be a number"
        )
        expect(makeOrderFactory.makeUpdateOrderFactory).not.toHaveBeenCalled()
    })
})
export {}
