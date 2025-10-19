import { describe, expect, it } from "vitest"

import { makeFindPaymentAllUseCase } from "./make-find-payment-all-use-case"

describe("makeFindPaymentAllUseCase", () => {
    it("should return an instance of FindPaymentAllUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeFindPaymentAllUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
