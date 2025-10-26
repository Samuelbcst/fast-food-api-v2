import { beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import * as factoryModule from "./make-category-update-dependencies"
import { updateCategory } from "./index"

// Hoist the dependency factory mock
vi.mock("./make-category-update-dependencies", () => ({
    makeUpdateCategoryFactory: vi.fn(),
}))

export {}

describe.skip("updateCategory", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        // Add required property to satisfy UpdateCategoryUseCase type if needed
        updateCategoryRepository: {} as any,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeUpdateCategoryFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls factory, validates input, executes use case, and returns result", async () => {
        const params = { id: "123" }
        const body = { name: "cat", description: "desc" }
        const result = await updateCategory(params, body)
        expect(factoryModule.makeUpdateCategoryFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            id: 123,
            name: "cat",
            description: "desc",
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(
            updateCategory({ id: "abc" }, { name: "cat" })
        ).rejects.toThrow("Id must be a number")
    })

    it("throws if name is missing", async () => {
        await expect(
            updateCategory({ id: "1" }, { description: "desc" })
        ).rejects.toThrow(/Required/)
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(
            updateCategory({ id: "1" }, { name: "cat" })
        ).rejects.toThrow("fail")
    })
})
