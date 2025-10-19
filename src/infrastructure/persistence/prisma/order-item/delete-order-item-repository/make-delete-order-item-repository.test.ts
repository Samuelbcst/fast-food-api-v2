import { describe, expect, it } from "vitest"

import { makeDeleteOrderItemRepository } from "./make-delete-order-item-repository"

describe("makeDeleteOrderItemRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeDeleteOrderItemRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
