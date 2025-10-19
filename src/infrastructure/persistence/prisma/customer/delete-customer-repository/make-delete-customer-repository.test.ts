import { describe, expect, it, vi } from "vitest"

import { makeDeleteCustomerRepository } from "./make-delete-customer-repository"

// Mock the CustomerModel import from the correct path used in delete-customer-repository.ts
vi.mock("../model", () => ({
    CustomerModel: {},
}))

vi.mock("../../", () => ({
    default: {
        initialize: vi.fn().mockResolvedValue(undefined),
        getRepository: vi.fn().mockReturnValue({}),
    },
}))

describe("makeDeleteCustomerRepository", () => {
    it("should initialize datasource and return repository instance", async () => {
        const repo = await makeDeleteCustomerRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})

export {}
