import { describe, expect, it } from "vitest"

import { Product } from "./product"

describe.skip("Product", () => {
    it("should have id, name, price, categoryId, createdAt, updatedAt, and optional active", () => {
        const now = new Date()
        const product: Product = {
            id: 1,
            name: "Book",
            price: 10.5,
            categoryId: 2,
            createdAt: now,
            updatedAt: now,
            active: true,
        }
        expect(product.id).toBe(1)
        expect(product.name).toBe("Book")
        expect(product.price).toBe(10.5)
        expect(product.categoryId).toBe(2)
        expect(product.createdAt).toBe(now)
        expect(product.updatedAt).toBe(now)
        expect(product.active).toBe(true)
    })

    it("should allow optional description and active", () => {
        const now = new Date()
        const product: Product = {
            id: 2,
            name: "Movie",
            price: 20,
            categoryId: 1,
            createdAt: now,
            updatedAt: now,
        }
        expect(product.description).toBeUndefined()
        expect(product.active).toBeUndefined()
    })
})
