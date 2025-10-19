import type { Category } from "@entities/category/category"
import { describe, expect, it } from "vitest"

import type { FindCategoryAllRepository } from "."

describe("FindCategoryAllRepository", () => {
    it("should implement execute and finish methods from RepositoryBase, returning an array of Category", async () => {
        class MockFindCategoryAllRepository
            implements FindCategoryAllRepository
        {
            async execute(): Promise<Category[]> {
                return [
                    {
                        id: 1,
                        name: "Cat1",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 2,
                        name: "Cat2",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ]
            }
            async finish(): Promise<void> {}
        }
        const repo = new MockFindCategoryAllRepository()
        const categories = await repo.execute()
        expect(Array.isArray(categories)).toBe(true)
        expect(categories.length).toBe(2)
        expect(categories[0].name).toBe("Cat1")
        expect(categories[1].name).toBe("Cat2")
        await expect(repo.finish()).resolves.toBeUndefined()
    })
})
