import { describe, expect, it } from "vitest"

import { makeFindProductByIdUseCase } from "./make-find-product-by-id-use-case"

describe("makeFindProductByIdUseCase", () => {
    it("should return an instance of FindProductByIdUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeFindProductByIdUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
