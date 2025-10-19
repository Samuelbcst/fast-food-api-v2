import { describe, expect, it, vi } from "vitest"

import { makeCreateCategoryRepository } from "./make-create-category-repository"

vi.mock("../../", () => ({
    default: {
        initialize: vi.fn().mockResolvedValue(undefined),
        getRepository: vi.fn().mockReturnValue({}),
    },
}))

vi.mock("../model", () => ({
    CategoryModel: {},
}))

describe("makeCreateCategoryRepository", () => {
    it("should initialize datasource and return repository instance", async () => {
        const repo = await makeCreateCategoryRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.create).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})
