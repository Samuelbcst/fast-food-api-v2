import { OrderStatus } from "@entities/order/order"
import { PaymentStatus } from "@entities/payment/payment"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { UpdateOrderStatusUseCase } from "./index"

describe("UpdateOrderStatusUseCase", () => {
    const persistedOrder = {
        id: 1,
        customerId: 1,
        items: [],
        status: OrderStatus.RECEIVED,
        createdAt: new Date(),
        statusUpdatedAt: new Date(),
        totalAmount: 20,
    }

    let updateRepository: any
    let findOrderRepository: any
    let findPaymentRepository: any
    let useCase: UpdateOrderStatusUseCase

    beforeEach(() => {
        updateRepository = {
            execute: vi.fn().mockResolvedValue({
                ...persistedOrder,
                status: OrderStatus.PREPARING,
            }),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        findOrderRepository = {
            execute: vi.fn().mockResolvedValue(persistedOrder),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        findPaymentRepository = {
            execute: vi.fn().mockResolvedValue({
                id: 99,
                orderId: persistedOrder.id,
                paymentStatus: PaymentStatus.APPROVED,
            }),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new UpdateOrderStatusUseCase(
            updateRepository,
            findOrderRepository,
            findPaymentRepository
        )
    })

    it("updates status when transition is valid and payment approved", async () => {
        const result = await useCase.execute({
            id: persistedOrder.id,
            status: OrderStatus.PREPARING,
        })
        expect(findOrderRepository.execute).toHaveBeenCalledWith(
            persistedOrder.id
        )
        expect(findPaymentRepository.execute).toHaveBeenCalledWith(
            persistedOrder.id
        )
        expect(updateRepository.execute).toHaveBeenCalledWith({
            id: persistedOrder.id,
            status: OrderStatus.PREPARING,
        })
        expect(result.success).toBe(true)
        expect(result.result?.status).toBe(OrderStatus.PREPARING)
    })

    it("fails for invalid transition", async () => {
        const result = await useCase.execute({
            id: persistedOrder.id,
            status: OrderStatus.READY,
        })
        expect(result.success).toBe(false)
        expect(result.error?.message).toMatch(/invalid status transition/i)
        expect(updateRepository.execute).not.toHaveBeenCalled()
    })

    it("requires approved payment for PREPARING", async () => {
        findPaymentRepository.execute.mockResolvedValueOnce({
            id: 99,
            orderId: persistedOrder.id,
            paymentStatus: PaymentStatus.PENDING,
        })
        const result = await useCase.execute({
            id: persistedOrder.id,
            status: OrderStatus.PREPARING,
        })
        expect(result.success).toBe(false)
        expect(result.error?.message).toMatch(/payment must be approved/i)
        expect(updateRepository.execute).not.toHaveBeenCalled()
    })

    it("propagates repository update errors", async () => {
        updateRepository.execute.mockRejectedValueOnce(new Error("db"))
        const result = await useCase.execute({
            id: persistedOrder.id,
            status: OrderStatus.PREPARING,
        })
        expect(result.success).toBe(false)
        expect(result.error?.message).toBe("db")
    })

    it("calls finish on all repositories", async () => {
        await useCase.onFinish()
        expect(updateRepository.finish).toHaveBeenCalled()
        expect(findOrderRepository.finish).toHaveBeenCalled()
        expect(findPaymentRepository.finish).toHaveBeenCalled()
    })
})
