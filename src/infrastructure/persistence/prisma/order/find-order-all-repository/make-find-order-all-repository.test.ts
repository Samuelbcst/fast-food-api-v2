import { describe, expect, it } from "vitest"

import { makeFindOrderAllRepository } from "./make-find-order-all-repository"

describe("makeFindOrderAllRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindOrderAllRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
