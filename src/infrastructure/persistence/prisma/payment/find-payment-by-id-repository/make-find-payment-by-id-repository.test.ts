import { describe, expect, it } from "vitest"

import { makeFindPaymentByIdRepository } from "./make-find-payment-by-id-repository"

describe("makeFindPaymentByIdRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindPaymentByIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
