import { describe, expect, it } from "vitest"

import { makeFindCustomerByIdRepository } from "./make-find-customer-by-id-repository"

describe("makeFindCustomerByIdRepository", () => {
    it("should return repository instance with correct methods", async () => {
        const repo = await makeFindCustomerByIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
