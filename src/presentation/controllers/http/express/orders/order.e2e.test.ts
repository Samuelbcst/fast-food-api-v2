import request from "supertest"
import { describe, expect, it } from "vitest"

import app from "../app"

const api = request(app)

describe("Order E2E", () => {
    it("should place an order", async () => {
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
            categoryId,
            active: true,
        })
        const productId = productRes.body.id
        const res = await api.post("/api/v1/orders").send({
            customerId,
            items: [{ productId, quantity: 2 }],
        })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("id")
    })
})
