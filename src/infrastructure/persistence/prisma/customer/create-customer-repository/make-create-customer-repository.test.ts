import { describe, expect, it, vi } from "vitest"

import { makeCreateCustomerRepository } from "./make-create-customer-repository"

// Mock the CustomerModel import from the correct path used in create-customer-repository.ts
vi.mock("../model", () => ({
    CustomerModel: {},
}))

vi.mock("../../", () => ({
    default: {
        initialize: vi.fn().mockResolvedValue(undefined),
        getRepository: vi.fn().mockReturnValue({}),
    },
}))

describe("makeCreateCustomerRepository", () => {
    it("should initialize datasource and return repository instance", async () => {
        const repo = await makeCreateCustomerRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.create).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})

export {}
