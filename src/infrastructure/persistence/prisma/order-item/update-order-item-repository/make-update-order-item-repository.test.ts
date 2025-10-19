import { describe, expect, it } from "vitest"

import { makeUpdateOrderItemRepository } from "./make-update-order-item-repository"

describe("makeUpdateOrderItemRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeUpdateOrderItemRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
