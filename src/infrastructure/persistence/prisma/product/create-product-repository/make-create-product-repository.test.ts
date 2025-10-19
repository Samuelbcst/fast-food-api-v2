import { describe, expect, it } from "vitest"

import { makeCreateProductRepository } from "./make-create-product-repository"

describe("makeCreateProductRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeCreateProductRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.create).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
