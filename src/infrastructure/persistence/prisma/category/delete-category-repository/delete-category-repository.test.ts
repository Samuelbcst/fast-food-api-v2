import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeleteCategoryTypeORMRepository } from "./delete-category-repository"

// Mock the CategoryModel import from the correct path used in delete-category-repository.ts
vi.mock("../model", () => ({
    CategoryModel: {},
}))

const mockCategory = { id: 1, name: "cat", description: "desc" }

describe.skip("DeleteCategoryTypeORMRepository", () => {
    let repository: any
    let ormRepo: any

    beforeEach(() => {
        ormRepo = {
            findOneBy: vi.fn(),
            remove: vi.fn(),
            manager: { connection: { destroy: vi.fn() } },
        }
        repository = new DeleteCategoryTypeORMRepository(ormRepo)
    })

    it("should return null if category not found", async () => {
        ormRepo.findOneBy.mockResolvedValue(null)
        const result = await repository.execute({ id: 1 })
        expect(result).toBeNull()
        expect(ormRepo.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it("should remove and return the category if found", async () => {
        ormRepo.findOneBy.mockResolvedValue(mockCategory)
        ormRepo.remove.mockResolvedValue(undefined)
        const result = await repository.execute({ id: 1 })
        expect(result).toEqual(mockCategory)
        expect(ormRepo.remove).toHaveBeenCalledWith(mockCategory)
    })

    it("should call destroy on finish", async () => {
        await repository.finish()
        expect(ormRepo.manager.connection.destroy).toHaveBeenCalled()
    })
})

export {}
