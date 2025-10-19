import { beforeEach, describe, expect, it, vi } from "vitest"

import { deleteCategory } from "./index"
import { makeDeleteCategoryFactory } from "./make-category-delete-dependencies"

vi.mock("./make-category-delete-dependencies", () => ({
    makeDeleteCategoryFactory: vi.fn(),
}))

const mockExecute = vi.fn()
const mockOnFinish = vi.fn()
const mockUseCase = { execute: mockExecute, onFinish: mockOnFinish }
const mockedMakeDeleteCategoryFactory = vi.mocked(
    makeDeleteCategoryFactory,
    true
)

describe("deleteCategory", () => {
    beforeEach(() => {
        mockExecute.mockReset()
        mockOnFinish.mockReset()
        mockedMakeDeleteCategoryFactory.mockReset()
        mockedMakeDeleteCategoryFactory.mockResolvedValue(mockUseCase as any)
    })

    it("should delete a category and return the result", async () => {
        const params = { id: "123" }
        const fakeResult = { success: true }
        mockExecute.mockResolvedValue(fakeResult)
        mockOnFinish.mockResolvedValue(undefined)
        const result = await deleteCategory(params)
        expect(mockedMakeDeleteCategoryFactory).toHaveBeenCalled()
        expect(mockExecute).toHaveBeenCalledWith({ id: 123 })
        expect(mockOnFinish).toHaveBeenCalled()
        expect(result).toBe(fakeResult)
    })

    it("should throw if id is not a number", async () => {
        const params = { id: "abc" }
        await expect(deleteCategory(params)).rejects.toThrow(
            /Id must be a number/
        )
        expect(mockedMakeDeleteCategoryFactory).not.toHaveBeenCalled()
    })
})

export {}
