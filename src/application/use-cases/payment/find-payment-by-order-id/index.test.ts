import { PaymentStatus } from "@entities/payment/payment"
import { CustomError } from "@application/use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindPaymentByOrderIdUseCase } from "."

describe("FindPaymentByOrderIdUseCase", () => {
    const payment = {
        id: 1,
        orderId: 10,
        amount: 50,
        paymentStatus: PaymentStatus.APPROVED,
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    let repository: any
    let useCase: FindPaymentByOrderIdUseCase

    beforeEach(() => {
        repository = {
            execute: vi.fn(),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindPaymentByOrderIdUseCase(repository)
    })

    it("returns the payment when found", async () => {
        repository.execute.mockResolvedValue(payment)
        const result = await useCase.execute({ orderId: 10 })
        expect(repository.execute).toHaveBeenCalledWith(10)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(payment)
    })

    it("returns 404 error when payment is missing", async () => {
        repository.execute.mockResolvedValue(null)
        const result = await useCase.execute({ orderId: 10 })
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.code).toBe(404)
    })

    it("wraps repository errors", async () => {
        repository.execute.mockRejectedValue(new Error("db error"))
        const result = await useCase.execute({ orderId: 10 })
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("db error")
    })

    it("calls finish on repository", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
