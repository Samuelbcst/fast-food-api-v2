import { describe, expect, it } from "vitest"

import { makeUpdatePaymentUseCase } from "./make-update-payment-use-case"

describe("makeUpdatePaymentUseCase", () => {
    it("should return an instance of UpdatePaymentUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeUpdatePaymentUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
