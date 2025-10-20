import request from "supertest"
import { describe, expect, it } from "vitest"

import app from "../app"

const api = request(app)

describe("Payment Webhook E2E", () => {
    it("should approve payment and move order to PREPARING", async () => {
        const customerRes = await api.post("/api/v1/customers").send({
            name: "WebhookUser",
            email: "webhook@example.com",
            cpf: "98765432100",
        })
        const customerId = customerRes.body.id

        const categoryRes = await api.post("/api/v1/categories").send({
            name: "WebhookCategory",
        })
        const categoryId = categoryRes.body.id

        const productRes = await api.post("/api/v1/products").send({
            name: "Webhook Burger",
            price: 20,
            categoryId,
            active: true,
        })
        const productId = productRes.body.id

        const orderRes = await api.post("/api/v1/orders").send({
            customerId,
            items: [{ productId, quantity: 1 }],
        })
        const orderId = orderRes.body.id

        const paymentRes = await api.post("/api/v1/payments").send({ orderId })
        expect(paymentRes.status).toBe(201)

        const webhookRes = await api.post("/api/v1/payments/webhook").send({
            orderId,
            status: "APPROVED",
        })

        expect(webhookRes.status).toBe(200)
        expect(webhookRes.body.payment.paymentStatus).toBe("APPROVED")
        expect(webhookRes.body.orderStatus).toBe("PREPARING")

        const paymentStatusRes = await api
            .get(`/api/v1/payments/order/${orderId}`)
            .send()
        expect(paymentStatusRes.status).toBe(200)
        expect(paymentStatusRes.body.paymentStatus).toBe("APPROVED")

        const orderStatusRes = await api
            .get(`/api/v1/orders/${orderId}`)
            .send()
        expect(orderStatusRes.status).toBe(200)
        expect(orderStatusRes.body.status).toBe("PREPARING")
    })
})
