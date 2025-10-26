import { PaymentStatus } from "@entities/payment/payment"
import { CustomError } from "@application/use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeletePaymentUseCase } from "."

describe("DeletePaymentUseCase", () => {
    const mockPayment = {
        id: 1,
        orderId: 1,
        paymentStatus: PaymentStatus.APPROVED,
        paidAt: new Date(),
    }
    let deletePaymentRepository: any
    let useCase: DeletePaymentUseCase

    beforeEach(() => {
        deletePaymentRepository = {
            execute: vi.fn(),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new DeletePaymentUseCase(deletePaymentRepository)
    })

    it("should delete a payment successfully", async () => {
        deletePaymentRepository.execute.mockResolvedValue(mockPayment)
        const result = await useCase.execute({ id: 1 })
        expect(deletePaymentRepository.execute).toHaveBeenCalledWith({ id: 1 })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(mockPayment)
    })

    it("should return error if payment not found", async () => {
        deletePaymentRepository.execute.mockResolvedValue(null)
        const result = await useCase.execute({ id: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Payment not found.")
        expect(result.error?.code).toBe(404)
    })

    it("should return error if repository throws", async () => {
        deletePaymentRepository.execute.mockRejectedValue(new Error("DB error"))
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeUndefined()
    })

    it("should call finish on onFinish", async () => {
        await useCase.onFinish()
        expect(deletePaymentRepository.finish).toHaveBeenCalled()
    })
})
