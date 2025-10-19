import { describe, expect, it } from "vitest"

import { makeDeleteProductUseCase } from "./make-delete-product-use-case"

describe("makeDeleteProductUseCase", () => {
    it("should return an instance of DeleteProductUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeDeleteProductUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
