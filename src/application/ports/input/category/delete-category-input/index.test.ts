import type { BaseEntity } from "@entities/base-entity"
import type { Category } from "@entities/category/category"
import { describe, expect, it } from "vitest"

import type { DeleteCategoryOutputPort } from "@application/ports/output/category/delete-category-output-port"

describe.skip("DeleteCategoryOutputPort", () => {
    it("should implement execute and finish methods from RepositoryBase", async () => {
        class MockDeleteCategoryRepository implements DeleteCategoryOutputPort {
            async execute(param: { id: number }): Promise<Category | null> {
                if (param.id === 1) {
                    return {
                        id: 1,
                        name: "TestCat",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
                return null
            }
            async finish(): Promise<void> {}
        }
        const repo = new MockDeleteCategoryRepository()
        const found = await repo.execute({ id: 1 })
        expect(found).toBeDefined()
        expect(found?.id).toBe(1)
        expect(found?.name).toBe("TestCat")
        const notFound = await repo.execute({ id: 2 })
        expect(notFound).toBeNull()
        await expect(repo.finish()).resolves.toBeUndefined()
    })
})
