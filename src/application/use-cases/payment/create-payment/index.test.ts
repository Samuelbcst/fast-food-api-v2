import { PaymentStatus } from "@entities/payment/payment"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreatePaymentUseCase } from "."

const input = {
    orderId: 1,
    amount: 100.0,
    paymentStatus: PaymentStatus.NOT_PAID,
    paidAt: new Date(),
}
const payment = {
    id: 1,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
}
const order = { id: 1, totalAmount: 100.0 }

let repository: any
let findOrderByIdRepository: any
let useCase: CreatePaymentUseCase

beforeEach(() => {
    repository = {
        create: vi.fn().mockResolvedValue(payment),
        finish: vi.fn().mockResolvedValue(undefined),
    }
    findOrderByIdRepository = {
        execute: vi.fn().mockResolvedValue(order),
        finish: vi.fn().mockResolvedValue(undefined),
    }
    useCase = new CreatePaymentUseCase(repository, findOrderByIdRepository)
})

describe("CreatePaymentUseCase", () => {
    it("should create a payment successfully", async () => {
        const result = await useCase.execute(input)
        expect(repository.create).toHaveBeenCalled()
        expect(result.success).toBe(true)
        expect(result.result).toEqual(payment)
    })

    it("should return error if repository throws", async () => {
        repository.create = vi.fn().mockRejectedValue(new Error("DB error"))
        useCase = new CreatePaymentUseCase(repository, findOrderByIdRepository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("DB error")
    })

    it("should return error if order is not found", async () => {
        findOrderByIdRepository.execute = vi.fn().mockResolvedValue(null)
        useCase = new CreatePaymentUseCase(repository, findOrderByIdRepository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Order not found")
    })

    it("should return error if payment amount does not match order total", async () => {
        findOrderByIdRepository.execute = vi
            .fn()
            .mockResolvedValue({ id: 1, totalAmount: 200 })
        useCase = new CreatePaymentUseCase(repository, findOrderByIdRepository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe(
            "Payment amount must match order total"
        )
    })

    it("should call finish on onFinish", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
        expect(findOrderByIdRepository.finish).toHaveBeenCalled()
    })
})
