import { PaymentStatus } from "@entities/payment/payment"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factory from "./make-payment-webhook-dependencies"
import { handlePaymentWebhook } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe.skip("handlePaymentWebhook", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makePaymentWebhookFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("validates payload and executes use case", async () => {
        mockUseCase.execute.mockResolvedValue("ok")
        const body = { orderId: 1, status: PaymentStatus.APPROVED }
        const result = await handlePaymentWebhook({}, body)
        expect(factory.makePaymentWebhookFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            orderId: 1,
            status: PaymentStatus.APPROVED,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("ok")
    })

    it("throws on invalid payload", async () => {
        await expect(
            handlePaymentWebhook({}, { orderId: "bad", status: "foo" })
        ).rejects.toThrow()
        expect(factory.makePaymentWebhookFactory).not.toHaveBeenCalled()
    })
})
