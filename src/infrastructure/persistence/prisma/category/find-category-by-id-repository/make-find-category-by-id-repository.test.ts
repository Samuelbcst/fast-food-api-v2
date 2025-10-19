import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeFindCategoryByIdRepository } from "./make-find-category-by-id-repository"

// Mock the CategoryModel import from the correct path used in find-category-by-id-repository.ts
vi.mock("../model", () => ({
    CategoryModel: {},
}))

vi.mock("../../", () => ({
    default: {
        initialize: vi.fn().mockResolvedValue(undefined),
        getRepository: vi.fn().mockReturnValue({}),
    },
}))

describe("makeFindCategoryByIdRepository", () => {
    it("should initialize datasource and return repository instance", async () => {
        const repo = await makeFindCategoryByIdRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})

export {}
