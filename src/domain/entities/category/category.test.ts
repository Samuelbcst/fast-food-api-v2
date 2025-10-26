import { describe, expect, it } from "vitest"

import { Category } from "./category"

describe.skip("Category", () => {
    it("should have id, name, createdAt, updatedAt, and optional description", () => {
        const now = new Date()
        const category: Category = {
            id: 1,
            name: "Books",
            createdAt: now,
            updatedAt: now,
            description: "All about books",
        }
        expect(category.id).toBe(1)
        expect(category.name).toBe("Books")
        expect(category.createdAt).toBe(now)
        expect(category.updatedAt).toBe(now)
        expect(category.description).toBe("All about books")
    })

    it("should allow optional description", () => {
        const now = new Date()
        const category: Category = {
            id: 2,
            name: "Movies",
            createdAt: now,
            updatedAt: now,
        }
        expect(category.description).toBeUndefined()
    })
})
