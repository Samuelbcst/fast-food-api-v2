import { describe, expect, it } from "vitest"

import { OrderItem } from "./order-item"

describe.skip("OrderItem", () => {
    it("should have id, orderId, productId, productName, unitPrice, quantity, createdAt, updatedAt", () => {
        const now = new Date()
        const item: OrderItem = {
            id: 1,
            orderId: 10,
            productId: 5,
            productName: "Burger",
            unitPrice: 15.5,
            quantity: 2,
            createdAt: now,
            updatedAt: now,
        }
        expect(item.id).toBe(1)
        expect(item.orderId).toBe(10)
        expect(item.productId).toBe(5)
        expect(item.productName).toBe("Burger")
        expect(item.unitPrice).toBe(15.5)
        expect(item.quantity).toBe(2)
        expect(item.createdAt).toBe(now)
        expect(item.updatedAt).toBe(now)
    })
})
