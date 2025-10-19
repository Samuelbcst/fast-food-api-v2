import { beforeEach, describe, expect, it, vi } from "vitest"

import { getCategoryAll } from "./index"
import { makeGetCategoryAllFactory } from "./make-category-get-all-dependencies"

vi.mock("./make-category-get-all-dependencies", () => ({
    makeGetCategoryAllFactory: vi.fn(),
}))

const mockExecute = vi.fn()
const mockOnFinish = vi.fn()
const mockUseCase = { execute: mockExecute, onFinish: mockOnFinish }
const mockedMakeGetCategoryAllFactory = vi.mocked(
    makeGetCategoryAllFactory,
    true
)

describe("getCategoryAll", () => {
    beforeEach(() => {
        mockExecute.mockReset()
        mockOnFinish.mockReset()
        mockedMakeGetCategoryAllFactory.mockReset()
        mockedMakeGetCategoryAllFactory.mockResolvedValue(mockUseCase as any)
    })

    it("should get all categories and return the result", async () => {
        const fakeResult = [
            { id: 1, name: "A" },
            { id: 2, name: "B" },
        ]
        mockExecute.mockResolvedValue(fakeResult)
        mockOnFinish.mockResolvedValue(undefined)
        const result = await getCategoryAll()
        expect(mockedMakeGetCategoryAllFactory).toHaveBeenCalled()
        expect(mockExecute).toHaveBeenCalled()
        expect(mockOnFinish).toHaveBeenCalled()
        expect(result).toBe(fakeResult)
    })
})

export {}
