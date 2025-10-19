import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { UpdatePaymentUseCase } from "."

describe("UpdatePaymentUseCase", () => {
    const mockPayment = {
        id: 1,
        orderId: 1,
        paymentStatus: "PAID",
        paidAt: new Date(),
    }
    let updatePaymentRepository: any
    let useCase: UpdatePaymentUseCase

    beforeEach(() => {
        updatePaymentRepository = {
            execute: vi.fn(),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new UpdatePaymentUseCase(updatePaymentRepository)
    })

    it("should update a payment successfully", async () => {
        updatePaymentRepository.execute.mockResolvedValue(mockPayment)
        const result = await useCase.execute({
            id: 1,
            amount: 100,
            status: "PAID",
        })
        expect(updatePaymentRepository.execute).toHaveBeenCalledWith({
            id: 1,
            amount: 100,
            status: "PAID",
        })
        expect(result.success).toBe(true)
        expect(result.result).toEqual(mockPayment)
    })

    it("should return error if payment not found", async () => {
        updatePaymentRepository.execute.mockResolvedValue(null)
        const result = await useCase.execute({ id: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Payment not found.")
        expect(result.error?.code).toBe(404)
    })

    it("should return error if repository throws", async () => {
        updatePaymentRepository.execute.mockRejectedValue(new Error("DB error"))
        const result = await useCase.execute({ id: 1 })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeUndefined()
    })

    it("should call finish on onFinish", async () => {
        await useCase.onFinish()
        expect(updatePaymentRepository.finish).toHaveBeenCalled()
    })
})
