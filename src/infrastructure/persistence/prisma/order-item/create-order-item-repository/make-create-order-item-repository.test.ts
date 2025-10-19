import { describe, expect, it } from "vitest"

import { makeCreateOrderItemRepository } from "./make-create-order-item-repository"

describe("makeCreateOrderItemRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeCreateOrderItemRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.create).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
