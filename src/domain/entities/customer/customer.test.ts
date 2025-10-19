import { describe, expect, it } from "vitest"

import { Customer } from "./customer"

describe("Customer", () => {
    it("should have id, name, email, cpf, createdAt, updatedAt", () => {
        const now = new Date()
        const customer: Customer = {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            cpf: "123.456.789-00",
            createdAt: now,
            updatedAt: now,
        }
        expect(customer.id).toBe(1)
        expect(customer.name).toBe("John Doe")
        expect(customer.email).toBe("john@example.com")
        expect(customer.cpf).toBe("123.456.789-00")
        expect(customer.createdAt).toBe(now)
        expect(customer.updatedAt).toBe(now)
    })
})
