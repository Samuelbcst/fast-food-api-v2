import { describe, expect, it } from "vitest"

import { makeFindProductAllUseCase } from "./make-find-product-all-use-case"

describe("makeFindProductAllUseCase", () => {
    it("should return an instance of FindProductAllUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeFindProductAllUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
