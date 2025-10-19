import { describe, expect, it } from "vitest"

import { makeFindProductByIdRepository } from "./make-find-product-by-id-repository"

describe("makeFindProductByIdRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindProductByIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
