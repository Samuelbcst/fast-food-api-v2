import type { Category } from "@entities/category/category"
import { describe, expect, it } from "vitest"

import type { UpdateCategoryRepository } from "."

describe("UpdateCategoryRepository", () => {
    it("should implement execute and finish methods from RepositoryBase, updating and returning a Category or null", async () => {
        class MockUpdateCategoryRepository implements UpdateCategoryRepository {
            async execute(param: {
                id: number
                name?: string
                description?: string
            }): Promise<Category | null> {
                if (param.id === 1) {
                    return {
                        id: 1,
                        name: param.name ?? "Cat1",
                        description: param.description,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
                return null
            }
            async finish(): Promise<void> {}
        }
        const repo = new MockUpdateCategoryRepository()
        const updated = await repo.execute({
            id: 1,
            name: "UpdatedCat",
            description: "desc",
        })
        expect(updated).toBeDefined()
        expect(updated?.id).toBe(1)
        expect(updated?.name).toBe("UpdatedCat")
        expect(updated?.description).toBe("desc")
        const notFound = await repo.execute({ id: 2 })
        expect(notFound).toBeNull()
        await expect(repo.finish()).resolves.toBeUndefined()
    })
})
