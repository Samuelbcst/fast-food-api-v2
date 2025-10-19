import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeFindCategoryAllRepository } from "./make-find-category-all-repository"

// Mock the CategoryModel import from the correct path used in find-category-all-repository.ts
vi.mock("../model", () => ({
    CategoryModel: {},
}))

vi.mock("../../", () => ({
    default: {
        initialize: vi.fn().mockResolvedValue(undefined),
        getRepository: vi.fn().mockReturnValue({}),
    },
}))

describe("makeFindCategoryAllRepository", () => {
    it("should initialize datasource and return repository instance", async () => {
        const repo = await makeFindCategoryAllRepository()
        expect(repo).toBeDefined()
        expect(typeof repo.execute).toBe("function")
        expect(typeof repo.finish).toBe("function")
    })
})

export {}
