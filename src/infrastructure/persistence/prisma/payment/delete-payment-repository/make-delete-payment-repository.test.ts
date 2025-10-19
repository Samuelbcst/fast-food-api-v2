import { describe, expect, it } from "vitest"

import { makeDeletePaymentRepository } from "./make-delete-payment-repository"

describe("makeDeletePaymentRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeDeletePaymentRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
