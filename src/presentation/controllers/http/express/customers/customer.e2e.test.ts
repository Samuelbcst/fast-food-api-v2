import request from "supertest"
import { describe, expect, it } from "vitest"

import app from "../app"

const api = request(app)

describe.skip("Customer E2E", () => {
    it("should register a customer", async () => {
        const res = await api.post("/api/v1/customers").send({
            name: "TestUser",
            email: "testuser@example.com",
            cpf: "12345678901",
        })
        console.log(res.body)
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("id")
    })
})
