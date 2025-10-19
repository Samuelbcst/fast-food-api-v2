import { describe, expect, it } from "vitest"

import { makeFindOrderByIdRepository } from "./make-find-order-by-id-repository"

describe("makeFindOrderByIdRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindOrderByIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
