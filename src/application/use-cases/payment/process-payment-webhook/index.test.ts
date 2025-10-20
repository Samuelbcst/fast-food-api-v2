import { OrderStatus } from "@entities/order/order"
import { PaymentStatus } from "@entities/payment/payment"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ProcessPaymentWebhookUseCase } from "."

describe("ProcessPaymentWebhookUseCase", () => {
    const payment = {
        id: 1,
        orderId: 5,
        amount: 20,
        paymentStatus: PaymentStatus.PENDING,
        paidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    let paymentFinder: any
    let paymentUpdater: any
    let orderStatusUseCase: any
    let useCase: ProcessPaymentWebhookUseCase

    beforeEach(() => {
        paymentFinder = {
            execute: vi.fn().mockResolvedValue(payment),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        paymentUpdater = {
            execute: vi.fn().mockResolvedValue({
                ...payment,
                paymentStatus: PaymentStatus.APPROVED,
                paidAt: new Date(),
            }),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        orderStatusUseCase = {
            execute: vi.fn().mockResolvedValue({
                success: true,
                result: { id: 5, status: OrderStatus.PREPARING },
            }),
            onFinish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new ProcessPaymentWebhookUseCase(
            paymentFinder,
            paymentUpdater,
            orderStatusUseCase
        )
    })

    it("updates payment and order when approved", async () => {
        const result = await useCase.execute({
            orderId: payment.orderId,
            status: PaymentStatus.APPROVED,
        })
        expect(paymentFinder.execute).toHaveBeenCalledWith(payment.orderId)
        expect(paymentUpdater.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                id: payment.id,
                paymentStatus: PaymentStatus.APPROVED,
            })
        )
        expect(orderStatusUseCase.execute).toHaveBeenCalledWith({
            id: payment.orderId,
            status: OrderStatus.PREPARING,
        })
        expect(result.success).toBe(true)
        expect(result.result?.orderStatus).toBe(OrderStatus.PREPARING)
    })

    it("returns error for unsupported status", async () => {
        const result = await useCase.execute({
            orderId: payment.orderId,
            status: PaymentStatus.PENDING,
        })
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.code).toBe(400)
        expect(paymentFinder.execute).not.toHaveBeenCalled()
    })

    it("returns error when payment not found", async () => {
        paymentFinder.execute.mockResolvedValueOnce(null)
        const result = await useCase.execute({
            orderId: payment.orderId,
            status: PaymentStatus.REJECTED,
        })
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.code).toBe(404)
    })

    it("does not update order when rejected", async () => {
        paymentUpdater.execute.mockResolvedValueOnce({
            ...payment,
            paymentStatus: PaymentStatus.REJECTED,
            paidAt: null,
        })
        const result = await useCase.execute({
            orderId: payment.orderId,
            status: PaymentStatus.REJECTED,
        })
        expect(result.success).toBe(true)
        expect(orderStatusUseCase.execute).not.toHaveBeenCalled()
        expect(result.result?.orderStatus).toBeUndefined()
    })

    it("propagates order status errors", async () => {
        orderStatusUseCase.execute.mockResolvedValueOnce({
            success: false,
            result: null,
            error: new CustomError(400, "invalid"),
        })
        const result = await useCase.execute({
            orderId: payment.orderId,
            status: PaymentStatus.APPROVED,
        })
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("invalid")
    })

    it("calls finish on all ports", async () => {
        await useCase.onFinish()
        expect(paymentFinder.finish).toHaveBeenCalled()
        expect(paymentUpdater.finish).toHaveBeenCalled()
        expect(orderStatusUseCase.onFinish).toHaveBeenCalled()
    })
})
