import { describe, expect, it } from "vitest"

import { makeUpdatePaymentRepository } from "./make-update-payment-repository"

describe("makeUpdatePaymentRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeUpdatePaymentRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
