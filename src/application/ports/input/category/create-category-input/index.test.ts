import type { BaseEntity } from "@entities/base-entity"
import type { Category } from "@entities/category/category"
import { describe, expect, it } from "vitest"

import type { CreateCategoryRepository } from "."

describe("CreateCategoryRepository", () => {
    it("should define a create method that returns a Category and a finish method", async () => {
        class MockCreateCategoryRepository implements CreateCategoryRepository {
            async create(
                input: Omit<Category, keyof BaseEntity>
            ): Promise<Category> {
                return {
                    id: 1,
                    ...input,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            }
            async finish(): Promise<void> {}
        }
        const repo = new MockCreateCategoryRepository()
        const input = { name: "Test", description: "desc" }
        const category = await repo.create(input)
        expect(category.id).toBe(1)
        expect(category.name).toBe("Test")
        expect(category.description).toBe("desc")
        expect(category.createdAt).toBeInstanceOf(Date)
        expect(category.updatedAt).toBeInstanceOf(Date)
        await expect(repo.finish()).resolves.toBeUndefined()
    })
})
