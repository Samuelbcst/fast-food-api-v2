import { describe, expect, it } from "vitest"

import { makeUpdateProductUseCase } from "./make-update-product-use-case"

describe("makeUpdateProductUseCase", () => {
    it("should return an instance of UpdateProductUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeUpdateProductUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
