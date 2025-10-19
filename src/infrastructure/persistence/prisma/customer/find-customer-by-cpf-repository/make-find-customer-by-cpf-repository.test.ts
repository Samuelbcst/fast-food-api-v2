import { describe, expect, it } from "vitest"

import { makeFindCustomerByCpfRepository } from "./make-find-customer-by-cpf-repository"

describe("makeFindCustomerByCpfRepository", () => {
    it("should return repository instance with correct methods", async () => {
        const repo = await makeFindCustomerByCpfRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
