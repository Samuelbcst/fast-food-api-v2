import { beforeEach, describe, expect, it, vi } from "vitest"

import { createCategory } from "./index"
import { makeCreateCategoryFactory } from "./make-category-create-dependencies"

vi.mock("./make-category-create-dependencies", () => ({
    makeCreateCategoryFactory: vi.fn(),
}))

const mockExecute = vi.fn()
const mockOnFinish = vi.fn()
const mockUseCase = { execute: mockExecute, onFinish: mockOnFinish }

const mockedMakeCreateCategoryFactory = vi.mocked(
    makeCreateCategoryFactory,
    true
)

describe.skip("createCategory", () => {
    beforeEach(() => {
        mockExecute.mockReset()
        mockOnFinish.mockReset()
        mockedMakeCreateCategoryFactory.mockReset()
        mockedMakeCreateCategoryFactory.mockResolvedValue(mockUseCase as any)
    })

    it("should create a category and return the result", async () => {
        const body = { name: "Test Category", description: "desc" }
        const fakeResult = { success: true }
        mockExecute.mockResolvedValue(fakeResult)
        mockOnFinish.mockResolvedValue(undefined)
        const result = await createCategory({}, body)
        expect(mockedMakeCreateCategoryFactory).toHaveBeenCalled()
        expect(mockExecute).toHaveBeenCalledWith({
            name: "Test Category",
            description: "desc",
        })
        expect(mockOnFinish).toHaveBeenCalled()
        expect(result).toBe(fakeResult)
    })

    it("should throw if name is missing", async () => {
        const body = { description: "desc" }
        await expect(createCategory({}, body)).rejects.toThrow(/Required/)
        expect(mockedMakeCreateCategoryFactory).not.toHaveBeenCalled()
    })

    it("should allow description to be optional", async () => {
        const body = { name: "Test Category" }
        const fakeResult = { success: true }
        mockExecute.mockResolvedValue(fakeResult)
        mockOnFinish.mockResolvedValue(undefined)
        const result = await createCategory({}, body)
        expect(mockedMakeCreateCategoryFactory).toHaveBeenCalled()
        expect(mockExecute).toHaveBeenCalledWith({
            name: "Test Category",
            description: undefined,
        })
        expect(mockOnFinish).toHaveBeenCalled()
        expect(result).toBe(fakeResult)
    })
})

export {}
