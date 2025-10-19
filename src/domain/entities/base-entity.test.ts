import { describe, expect, it } from "vitest"

import { BaseEntity } from "./base-entity"

describe("BaseEntity", () => {
    it("should have id, createdAt, updatedAt properties", () => {
        const entity: BaseEntity = {
            id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        expect(entity.id).toBe(1)
        expect(entity.createdAt).toBeInstanceOf(Date)
        expect(entity.updatedAt).toBeInstanceOf(Date)
    })
})
