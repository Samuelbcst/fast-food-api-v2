import { describe, expect, it } from "vitest"

import { makeDeleteProductRepository } from "./make-delete-product-repository"

describe.skip("makeDeleteProductRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeDeleteProductRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
