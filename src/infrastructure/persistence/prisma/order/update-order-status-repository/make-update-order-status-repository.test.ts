import { describe, expect, it } from "vitest"

import { makeUpdateOrderStatusRepository } from "./make-update-order-status-repository"

describe.skip("makeUpdateOrderStatusRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeUpdateOrderStatusRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
