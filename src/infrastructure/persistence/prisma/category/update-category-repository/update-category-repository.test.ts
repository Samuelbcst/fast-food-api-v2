import { beforeEach, describe, expect, it, vi } from "vitest"

import { UpdateCategoryTypeORMRepository } from "./update-category-repository"

// Mock the CategoryModel import from the correct path used in update-category-repository.ts
vi.mock("../model", () => ({
    CategoryModel: {},
}))

const mockCategory = {
    id: 1,
    name: "cat",
    description: "desc",
    updatedAt: new Date(),
}

describe("UpdateCategoryTypeORMRepository", () => {
    let repository: any
    let ormRepo: any
    let now: Date

    beforeEach(() => {
        now = new Date()
        ormRepo = {
            findOneBy: vi.fn(),
            save: vi.fn(),
            manager: { connection: { destroy: vi.fn() } },
        }
        repository = new UpdateCategoryTypeORMRepository(ormRepo)
    })

    it("should return null if category not found", async () => {
        ormRepo.findOneBy.mockResolvedValue(null)
        const result = await repository.execute({
            id: 1,
            name: "new",
            description: "newdesc",
        })
        expect(result).toBeNull()
        expect(ormRepo.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it("should update name and description if provided", async () => {
        const category = { ...mockCategory }
        ormRepo.findOneBy.mockResolvedValue(category)
        ormRepo.save.mockResolvedValue(undefined)
        const result = await repository.execute({
            id: 1,
            name: "new",
            description: "newdesc",
        })
        expect(result).toEqual({
            ...category,
            name: "new",
            description: "newdesc",
        })
        expect(ormRepo.save).toHaveBeenCalledWith({
            ...category,
            name: "new",
            description: "newdesc",
        })
    })

    it("should only update name if description is not provided", async () => {
        const category = { ...mockCategory }
        ormRepo.findOneBy.mockResolvedValue(category)
        ormRepo.save.mockResolvedValue(undefined)
        const result = await repository.execute({ id: 1, name: "new" })
        expect(result).toEqual({ ...category, name: "new" })
        expect(ormRepo.save).toHaveBeenCalledWith({ ...category, name: "new" })
    })

    it("should only update description if name is not provided", async () => {
        const category = { ...mockCategory }
        ormRepo.findOneBy.mockResolvedValue(category)
        ormRepo.save.mockResolvedValue(undefined)
        const result = await repository.execute({
            id: 1,
            description: "newdesc",
        })
        expect(result).toEqual({ ...category, description: "newdesc" })
        expect(ormRepo.save).toHaveBeenCalledWith({
            ...category,
            description: "newdesc",
        })
    })

    it("should call destroy on finish", async () => {
        await repository.finish()
        expect(ormRepo.manager.connection.destroy).toHaveBeenCalled()
    })
})

export {}
