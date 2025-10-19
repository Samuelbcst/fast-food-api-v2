import { describe, expect, it } from "vitest"

import { makeCreatePaymentRepository } from "./make-create-payment-repository"

describe("makeCreatePaymentRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeCreatePaymentRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.create).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
