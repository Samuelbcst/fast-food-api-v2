import { Category } from "@entities/category/category"
import { describe, expect, it } from "vitest"

import type { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"

describe.skip("CreateCategoryOutputPort", () => {
    it("should define a create method that returns a Category and a finish method", async () => {
        class MockCreateCategoryRepository implements CreateCategoryOutputPort {
            async create(category: Category): Promise<Category> {
                // Return the same category instance (repository would persist and return)
                return category
            }
            async finish(): Promise<void> {}
        }
        const repo = new MockCreateCategoryRepository()
        const inputCategory = new Category("test-id", "Test", "desc", false)
        const category = await repo.create(inputCategory)
        expect(category.id).toBe("test-id")
        expect(category.name).toBe("Test")
        expect(category.description).toBe("desc")
        await expect(repo.finish()).resolves.toBeUndefined()
    })
})
