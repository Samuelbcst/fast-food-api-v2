import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factoryModule from "./make-category-get-by-id-dependencies"
import { getCategoryById } from "./index"

// Hoist the dependency factory mock
vi.mock("./make-category-get-by-id-dependencies", () => ({
    makeGetCategoryByIdFactory: vi.fn(),
}))

export {}

describe("getCategoryById", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        // Add required property to satisfy FindCategoryByIdUseCase type
        findCategoryByIdRepository: {} as any,
    }

    // Use type assertion to 'any' to bypass the private property check
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeGetCategoryByIdFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls factory, executes use case, and returns result", async () => {
        const params = { id: "123" }
        const result = await getCategoryById(params)
        expect(factoryModule.makeGetCategoryByIdFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 123 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(getCategoryById({ id: "abc" })).rejects.toThrow(
            "Id must be a number"
        )
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(getCategoryById({ id: "1" })).rejects.toThrow("fail")
    })
})

export {}
