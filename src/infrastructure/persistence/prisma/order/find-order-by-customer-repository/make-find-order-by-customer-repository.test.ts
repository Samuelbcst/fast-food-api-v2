import { describe, expect, it } from "vitest"

import { makeFindOrderByCustomerRepository } from "./make-find-order-by-customer-repository"

describe.skip("makeFindOrderByCustomerRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindOrderByCustomerRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
