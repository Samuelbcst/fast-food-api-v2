import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreateCategoryRepository } from "./create-category-repository"

// Mock the CategoryModel import from the correct path used in create-category-repository.ts
vi.mock("../model", () => ({
    CategoryModel: {
        create: vi.fn(),
    },
}))

const mockCategory = { name: "cat", description: "desc" }

describe("PrismaCreateCategoryRepository", () => {
    let repository: any
    let ormRepo: any
    let CategoryModel: any

    beforeEach(async () => {
        ormRepo = {
            manager: { connection: { destroy: vi.fn() } },
        }
        // Dynamically import the mocked module
        CategoryModel = (await vi.importMock("../model")).CategoryModel
        repository = new PrismaCreateCategoryRepository()
    })

    it("should create and save a category", async () => {
        const save = vi.fn().mockResolvedValue(undefined)
        CategoryModel.create.mockReturnValue({ ...mockCategory, save })
        await repository.create(mockCategory)
        expect(CategoryModel.create).toHaveBeenCalledWith(mockCategory)
        expect(save).toHaveBeenCalled()
    })

    it("should call destroy on finish", async () => {
        await repository.finish()
        expect(ormRepo.manager.connection.destroy).toHaveBeenCalled()
    })
})
