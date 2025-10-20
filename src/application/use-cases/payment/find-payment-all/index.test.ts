import { PaymentStatus } from "@entities/payment/payment"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindPaymentAllUseCase } from "."

describe("FindPaymentAllUseCase", () => {
    let findPaymentAllRepository: any
    let useCase: FindPaymentAllUseCase
    const mockPayments = [
        {
            id: 1,
            orderId: 1,
            paymentStatus: PaymentStatus.APPROVED,
            paidAt: new Date(),
        },
        {
            id: 2,
            orderId: 2,
            paymentStatus: PaymentStatus.PENDING,
            paidAt: null,
        },
    ]

    beforeEach(() => {
        findPaymentAllRepository = {
            execute: vi.fn(),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindPaymentAllUseCase(findPaymentAllRepository)
    })

    it("should return all payments successfully", async () => {
        findPaymentAllRepository.execute.mockResolvedValue(mockPayments)
        const result = await useCase.execute()
        expect(findPaymentAllRepository.execute).toHaveBeenCalled()
        expect(result.success).toBe(true)
        expect(result.result).toEqual(mockPayments)
    })

    it("should return empty array and success false if repository throws", async () => {
        findPaymentAllRepository.execute.mockRejectedValue(
            new Error("DB error")
        )
        const result = await useCase.execute()
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
    })

    it("should call finish on onFinish", async () => {
        await useCase.onFinish()
        expect(findPaymentAllRepository.finish).toHaveBeenCalled()
    })
})
