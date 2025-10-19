import { describe, expect, it } from "vitest"

import { makeCreateOrderRepository } from "./make-create-order-repository"

describe("makeCreateOrderRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeCreateOrderRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.create).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
