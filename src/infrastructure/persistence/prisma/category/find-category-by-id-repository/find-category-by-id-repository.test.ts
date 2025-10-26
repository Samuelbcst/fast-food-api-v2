import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindCategoryByIdTypeORMRepository } from "./find-category-by-id-repository"

// Mock the CategoryModel import from the correct path used in find-category-by-id-repository.ts
vi.mock("../model", () => ({
    CategoryModel: {},
}))

const mockCategory = { id: 1, name: "cat", description: "desc" }

describe.skip("FindCategoryByIdTypeORMRepository", () => {
    let repository: any
    let ormRepo: any

    beforeEach(() => {
        ormRepo = {
            findOneBy: vi.fn(),
            manager: { connection: { destroy: vi.fn() } },
        }
        repository = new FindCategoryByIdTypeORMRepository(ormRepo)
    })

    it("should return the category if found", async () => {
        ormRepo.findOneBy.mockResolvedValue(mockCategory)
        const result = await repository.execute(1)
        expect(result).toEqual(mockCategory)
        expect(ormRepo.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it("should return null if not found", async () => {
        ormRepo.findOneBy.mockResolvedValue(null)
        const result = await repository.execute(2)
        expect(result).toBeNull()
        expect(ormRepo.findOneBy).toHaveBeenCalledWith({ id: 2 })
    })

    it("should call destroy on finish", async () => {
        await repository.finish()
        expect(ormRepo.manager.connection.destroy).toHaveBeenCalled()
    })
})

export {}
