import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makePaymentFactory from "./make-payment-create-dependencies"
import { createPayment } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any // satisfy type, ignore private fields

describe("createPayment", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(
            makePaymentFactory,
            "makeCreatePaymentFactory"
        ).mockResolvedValue(mockUseCase)
    })

    it("creates payment with valid input and returns result", async () => {
        mockUseCase.execute.mockResolvedValue("payment-result")
        const body = {
            orderId: 1,
            amount: 100,
        }
        const result = await createPayment({}, body)
        expect(makePaymentFactory.makeCreatePaymentFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            orderId: 1,
            amount: 100,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("payment-result")
    })

    it("creates payment using order total when amount omitted", async () => {
        mockUseCase.execute.mockResolvedValue("payment-result")
        const body = { orderId: 1 }
        const result = await createPayment({}, body)
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            orderId: 1,
        })
        expect(result).toBe("payment-result")
    })

    it("throws if input is invalid", async () => {
        await expect(
            createPayment({}, { orderId: "bad", amount: "bad" })
        ).rejects.toThrow()
        expect(
            makePaymentFactory.makeCreatePaymentFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
