import { describe, expect, it } from "vitest"

import { makeFindProductByCategoryRepository } from "./make-find-product-by-category-repository"

describe("makeFindProductByCategoryRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindProductByCategoryRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
