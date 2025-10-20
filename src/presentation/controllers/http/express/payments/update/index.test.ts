import { PaymentStatus } from "@entities/payment/payment"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factory from "./make-payment-update-dependencies"
import { updatePayment } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe("updatePayment", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeUpdatePaymentFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("updates payment with valid input and returns result", async () => {
        mockUseCase.execute.mockResolvedValue("payment-result")
        const params = { id: "1" }
        const body = { paymentStatus: PaymentStatus.APPROVED, amount: 25 }
        const result = await updatePayment(params, body)
        expect(factory.makeUpdatePaymentFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            id: 1,
            paymentStatus: PaymentStatus.APPROVED,
            amount: 25,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("payment-result")
    })

    it("updates payment with only id", async () => {
        mockUseCase.execute.mockResolvedValue("payment-result")
        const params = { id: "1" }
        const body = {}
        const result = await updatePayment(params, body)
        expect(factory.makeUpdatePaymentFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            id: 1,
        })
        expect(result).toBe("payment-result")
    })

    it("throws if id is not a number", async () => {
        await expect(updatePayment({ id: "abc" }, {})).rejects.toThrow(
            "Id must be a number"
        )
        expect(factory.makeUpdatePaymentFactory).not.toHaveBeenCalled()
    })
})
export {}
