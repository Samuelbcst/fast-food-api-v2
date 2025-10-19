import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeProductFactory from "../../products/get-by-id/make-product-get-by-id-dependencies"
import * as makeOrderFactory from "./make-order-create-dependencies"
import { OrderStatus } from "@entities/order/order"
import { createOrder } from "./index"

const mockProductUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any // satisfy type, ignore private fields
const mockOrderUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any // satisfy type, ignore private fields

describe("createOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makeProductFactory,
            "makeGetProductByIdFactory"
        ).mockResolvedValue(mockProductUseCase)
        vi.spyOn(makeOrderFactory, "makeCreateOrderFactory").mockResolvedValue(
            mockOrderUseCase
        )
    })

    it("creates order with valid input and returns result", async () => {
        const now = new Date()
        vi.useFakeTimers().setSystemTime(now)
        mockProductUseCase.execute.mockResolvedValue({
            success: true,
            result: { name: "P", price: 10 },
        })
        mockOrderUseCase.execute.mockResolvedValue("order-result")
        const body = { customerId: 1, items: [{ productId: 2, quantity: 3 }] }
        const result = await createOrder({}, body)
        expect(makeProductFactory.makeGetProductByIdFactory).toHaveBeenCalled()
        expect(mockProductUseCase.execute).toHaveBeenCalledWith({ id: 2 })
        expect(mockProductUseCase.onFinish).toHaveBeenCalled()
        expect(makeOrderFactory.makeCreateOrderFactory).toHaveBeenCalled()
        expect(mockOrderUseCase.execute).toHaveBeenCalledWith({
            customerId: 1,
            items: [
                expect.objectContaining({
                    productId: 2,
                    quantity: 3,
                    productName: "P",
                    unitPrice: 10,
                    createdAt: now,
                    updatedAt: now,
                }),
            ],
            status: OrderStatus.RECEIVED,
            statusUpdatedAt: now,
            totalAmount: 30,
        })
        expect(mockOrderUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("order-result")
        vi.useRealTimers()
    })

    it("throws if product not found", async () => {
        mockProductUseCase.execute.mockResolvedValue({ success: false })
        const body = { customerId: 1, items: [{ productId: 2, quantity: 3 }] }
        await expect(createOrder({}, body)).rejects.toThrow(
            "Product not found: 2"
        )
        expect(mockProductUseCase.onFinish).toHaveBeenCalled()
    })

    it("throws if input is invalid", async () => {
        await expect(
            createOrder({}, { customerId: "bad", items: [] })
        ).rejects.toThrow()
        expect(
            makeProductFactory.makeGetProductByIdFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
