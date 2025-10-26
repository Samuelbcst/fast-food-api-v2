import { describe, expect, it } from "vitest"

import { makeFindOrderItemAllRepository } from "./make-find-order-item-all-repository"

describe.skip("makeFindOrderItemAllRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindOrderItemAllRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
