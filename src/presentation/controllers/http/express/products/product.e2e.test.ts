import request from "supertest"
import { describe, expect, it } from "vitest"
import app from "../app"

const api = request(app)

describe.skip("Product E2E", () => {
    it("should create a product", async () => {
        const categoryRes = await api.post("/api/v1/categories").send({
            name: "Lanche",
            description: "Lanches deliciosos",
        })
        console.log(
            "Category creation response:",
            categoryRes.status,
            categoryRes.body
        )
        expect(categoryRes.status).toBe(201)
        expect(categoryRes.body).toHaveProperty("id")
        const categoryId = categoryRes.body.id
        const res = await api.post("/api/v1/products").send({
            name: "Hamburguer Teste",
            description: "Um hamburguer de teste",
            price: 15.5,
            categoryId,
            active: true,
        })
        console.log("Product creation response:", res.status, res.body)
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("id")
    })
})
