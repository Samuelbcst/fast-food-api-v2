import { describe, expect, it } from "vitest"

import { makeFindOrderItemByIdRepository } from "./make-find-order-item-by-id-repository"

describe("makeFindOrderItemByIdRepository", () => {
    it("should return repository instance", async () => {
        const repo = await makeFindOrderItemByIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
