import type { Category } from "@entities/category/category"
import { describe, expect, it } from "vitest"

import type { FindCategoryByIdOutputPort } from "@application/ports/output/category/find-category-by-id-output-port"

describe.skip("FindCategoryByIdOutputPort", () => {
    it("should implement execute and finish methods from RepositoryBase, returning a Category or null", async () => {
        class MockFindCategoryByIdRepository
            implements FindCategoryByIdRepository
        {
            async execute(id: number): Promise<Category | null> {
                if (id === 1) {
                    return {
                        id: 1,
                        name: "Cat1",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
                return null
            }
            async finish(): Promise<void> {}
        }
        const repo = new MockFindCategoryByIdRepository()
        const found = await repo.execute(1)
        expect(found).toBeDefined()
        expect(found?.id).toBe(1)
        expect(found?.name).toBe("Cat1")
        const notFound = await repo.execute(2)
        expect(notFound).toBeNull()
        await expect(repo.finish()).resolves.toBeUndefined()
    })
})
