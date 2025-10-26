import { describe, expect, it } from "vitest"

import { makeDeleteOrderRepository } from "./make-delete-order-repository"

describe.skip("makeDeleteOrderRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeDeleteOrderRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
