import { describe, expect, it, vi } from "vitest"

import { makeUpdateCustomerRepository } from "./make-update-customer-repository"

// Mock the CustomerModel import from the correct path used in update-customer-repository.ts
vi.mock("../model", () => ({
    CustomerModel: {},
}))

vi.mock("../../", () => ({
    default: {
        initialize: vi.fn().mockResolvedValue(undefined),
        getRepository: vi.fn().mockReturnValue({}),
    },
}))

describe("makeUpdateCustomerRepository", () => {
    it("should initialize datasource and return repository instance", async () => {
        const repo = await makeUpdateCustomerRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})

export {}
