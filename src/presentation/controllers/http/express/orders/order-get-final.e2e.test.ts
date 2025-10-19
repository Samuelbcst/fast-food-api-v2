import request from "supertest"
import { describe, expect, it } from "vitest"

import app from "../app"

const api = request(app)

describe("Order Get Final E2E", () => {
    it("should get the final order and verify status", async () => {
        const customerRes = await api.post("/api/v1/customers").send({
            name: "TestUser",
            email: "testuser@example.com",
            cpf: "12345678901",
        })
        const customerId = customerRes.body.id
        const categoryRes = await api.post("/api/v1/categories").send({
            name: "Lanche",
            description: "Lanches deliciosos",
        })
        const categoryId = categoryRes.body.id
        const productRes = await api.post("/api/v1/products").send({
            name: "Hamburguer Teste",
            description: "Um hamburguer de teste",
            price: 15.5,
            categoryId, // <-- use the correct key
            active: true,
        })
        const productId = productRes.body.id
        const orderRes = await api.post("/api/v1/orders").send({
            customerId,
            items: [{ productId, quantity: 2 }],
        })
        const orderId = orderRes.body.id
        await api
            .post("/api/v1/payments")
            .send({ orderId, paymentStatus: "PAID" })
        await api
            .put(`/api/v1/orders/${orderId}/status`)
            .send({ status: "PREPARING" })
        await api
            .put(`/api/v1/orders/${orderId}/status`)
            .send({ status: "READY" })
        await api
            .put(`/api/v1/orders/${orderId}/status`)
            .send({ status: "FINISHED" })
        await new Promise((r) => setTimeout(r, 200))
        const res = await api.get(`/api/v1/orders/${orderId}`)
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("FINISHED")
    })
})
