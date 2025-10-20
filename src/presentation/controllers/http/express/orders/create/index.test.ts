import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makeOrderFactory from "./make-order-create-dependencies"
import { createOrder } from "./index"

const mockOrderUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any // satisfy type, ignore private fields

describe("createOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(makeOrderFactory, "makeCreateOrderFactory").mockResolvedValue(
            mockOrderUseCase
        )
    })

    it("creates order with valid input and returns result", async () => {
        mockOrderUseCase.execute.mockResolvedValue("order-result")
        const body = { customerId: 1, items: [{ productId: 2, quantity: 3 }] }
        const result = await createOrder({}, body)
        expect(makeOrderFactory.makeCreateOrderFactory).toHaveBeenCalled()
        expect(mockOrderUseCase.execute).toHaveBeenCalledWith({
            customerId: 1,
            items: [{ productId: 2, quantity: 3 }],
        })
        expect(mockOrderUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("order-result")
    })

    it("throws if input is invalid", async () => {
        await expect(
            createOrder({}, { customerId: "bad", items: [] })
        ).rejects.toThrow()
    })
})
export {}
