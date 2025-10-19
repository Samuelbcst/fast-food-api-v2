import { beforeEach, describe, expect, it, vi } from "vitest"
import * as makePaymentFactory from "./make-payment-create-dependencies"
import { PaymentStatus } from "@entities/payment/payment"
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
        const now = new Date()
        vi.useFakeTimers().setSystemTime(now)
        mockUseCase.execute.mockResolvedValue("payment-result")
        const body = {
            orderId: 1,
            paymentStatus: PaymentStatus.PAID,
            paidAt: now,
        }
        const result = await createPayment({}, body)
        expect(makePaymentFactory.makeCreatePaymentFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            orderId: 1,
            paymentStatus: PaymentStatus.PAID,
            paidAt: now,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("payment-result")
        vi.useRealTimers()
    })

    it("creates payment without paidAt", async () => {
        mockUseCase.execute.mockResolvedValue("payment-result")
        // Use a valid PaymentStatus value that exists in your enum
        const validStatus = Object.values(PaymentStatus)[0]
        const body = { orderId: 1, paymentStatus: validStatus }
        const result = await createPayment({}, body)
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            orderId: 1,
            paymentStatus: validStatus,
        })
        expect(result).toBe("payment-result")
    })

    it("throws if input is invalid", async () => {
        await expect(
            createPayment({}, { orderId: "bad", paymentStatus: "bad" })
        ).rejects.toThrow()
        expect(
            makePaymentFactory.makeCreatePaymentFactory
        ).not.toHaveBeenCalled()
    })
})
export {}
