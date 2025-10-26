import { describe, expect, it } from "vitest"

import { Payment, PaymentStatus } from "./payment"

describe.skip("Payment", () => {
    it("should have id, orderId, paymentStatus, paidAt, createdAt, updatedAt", () => {
        const now = new Date()
        const payment: Payment = {
            id: 1,
            orderId: 10,
            amount: 100.0,
            paymentStatus: PaymentStatus.PENDING,
            paidAt: null,
            createdAt: now,
            updatedAt: now,
        }
        expect(payment.id).toBe(1)
        expect(payment.orderId).toBe(10)
        expect(payment.paymentStatus).toBe(PaymentStatus.PENDING)
        expect(payment.paidAt).toBeNull()
        expect(payment.createdAt).toBe(now)
        expect(payment.updatedAt).toBe(now)
    })

    it("should allow APPROVED and REJECTED statuses", () => {
        const now = new Date()
        const payment: Payment = {
            id: 2,
            orderId: 20,
            amount: 50.0,
            paymentStatus: PaymentStatus.APPROVED,
            paidAt: now,
            createdAt: now,
            updatedAt: now,
        }
        expect(payment.paymentStatus).toBe(PaymentStatus.APPROVED)
        const rejected: Payment = {
            ...payment,
            paymentStatus: PaymentStatus.REJECTED,
        }
        expect(rejected.paymentStatus).toBe(PaymentStatus.REJECTED)
    })
})
