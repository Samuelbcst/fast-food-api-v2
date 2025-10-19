import { describe, expect, it } from "vitest"

import { makeFindPaymentAllRepository } from "./make-find-payment-all-repository"

describe("makeFindPaymentAllRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindPaymentAllRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
