import { describe, expect, it } from "vitest"

import { makeUpdateProductRepository } from "./make-update-product-repository"

describe.skip("makeUpdateProductRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeUpdateProductRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
