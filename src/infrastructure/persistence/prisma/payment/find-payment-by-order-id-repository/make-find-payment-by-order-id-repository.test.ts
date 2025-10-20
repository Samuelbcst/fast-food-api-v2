import { describe, expect, it } from "vitest"

import { makeFindPaymentByOrderIdRepository } from "./make-find-payment-by-order-id-repository"

describe("makeFindPaymentByOrderIdRepository", () => {
    it("returns repository instance", async () => {
        const repo = await makeFindPaymentByOrderIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
