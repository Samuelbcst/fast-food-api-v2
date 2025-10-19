import { describe, expect, it } from "vitest"

import { makeCreateProductUseCase } from "./make-create-product-use-case"

describe("makeCreateProductUseCase", () => {
    it("should return an instance of CreateProductUseCase", () => {
        const mockRepo = { create: () => {}, finish: () => {} }
        const useCase = makeCreateProductUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
