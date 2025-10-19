import { describe, expect, it } from "vitest"

import { makeFindOrderByStatusRepository } from "./make-find-order-by-status-repository"

describe("makeFindOrderByStatusRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindOrderByStatusRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
