import { describe, expect, it } from "vitest"

import { makeFindProductAllRepository } from "./make-find-product-all-repository"

describe("makeFindProductAllRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindProductAllRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
