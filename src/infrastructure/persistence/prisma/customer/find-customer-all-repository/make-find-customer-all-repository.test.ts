import { describe, expect, it } from "vitest"

import { makeFindCustomerAllRepository } from "./make-find-customer-all-repository"

describe("makeFindCustomerAllRepository", () => {
    it("should return repository instance with correct methods", async () => {
        const repo = await makeFindCustomerAllRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
