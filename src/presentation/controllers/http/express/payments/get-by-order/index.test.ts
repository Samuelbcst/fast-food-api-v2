import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factory from "./make-payment-get-by-order-dependencies"
import { getPaymentByOrder } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe("getPaymentByOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeGetPaymentByOrderFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("executes use case with parsed orderId", async () => {
        mockUseCase.execute.mockResolvedValue("payment-result")
        const result = await getPaymentByOrder({ orderId: "12" })
        expect(factory.makeGetPaymentByOrderFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ orderId: 12 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("payment-result")
    })

    it("throws when orderId is NaN", async () => {
        await expect(getPaymentByOrder({ orderId: "abc" })).rejects.toThrow(
            "orderId must be a number"
        )
        expect(factory.makeGetPaymentByOrderFactory).not.toHaveBeenCalled()
    })
})
