import { describe, expect, it } from "vitest"

import { makeUpdateOrderRepository } from "./make-update-order-repository"

describe.skip("makeUpdateOrderRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeUpdateOrderRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
